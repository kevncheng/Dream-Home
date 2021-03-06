const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {User, Post, Board, Comment} = require('../models');
const {auth, pub} = require('../middleware');
const PostValidation = require('./validate/post');

const _ = require('lodash');

// @route    GET users/posts
// @desc     Get all posts based on user's interests or filter
// @access   Public
router.get('/', [
    pub,
    async (req, res) => {
        const {search_filter = '', easy_filters = '', size = 20} = req.query;
        try {
            let query;
            let searchTags = [];

            if (search_filter) {
                searchTags = [...searchTags, search_filter];
            }
            if (easy_filters) {
                searchTags = [...searchTags, ...easy_filters.split(',')];
            }
            // // Search by filters if present
            else if (!_.isEmpty(searchTags)) {
                query = {tags: {$all: searchTags}};
                // If not logged in will return a bunch of posts
            } else {
                query = {};
            }
            const posts = await Post.find(query)
                .limit(parseInt(size))
                .sort({$natural: -1})
                .select('-comments')
                .populate({path: 'user', select: 'username name profile'})
                .lean();
            const postsSize = await Post.find(query).countDocuments();
            res.send({posts, postsSize});
        } catch (err) {
            res.status(500).send('Something went wrong with the server');
        }
    }
]);

// @route    GET posts/:id/
// @desc     Get post from id
// @access   Public
router.get('/:id', [
    pub,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
                .populate({path: 'user', select: 'username name profile'})
                .lean();
            if(post === null) return res.status(404).json({message:'Post not found'});
            return res.json(post);
        } catch (err) {
            return res.status(500).send('Something went wrong with the server');
        }
    }
]);


// @route    GET posts/:id/comment
// @desc     gets comments from post id
// @access   Public
router.get('/:id/comment', [pub, async (req, res) => {
    try {
        const comments = await Post.findOne({_id: req.params.id})
            .select('comments')
            .populate({
                path: 'comments',
                populate: {path: 'user', select: 'username name profile'}
            })
            .populate({
                path: 'comments',
                populate: {path: 'childComments', populate: {path: 'user', select: 'username name profile'}}
            });
        return res.json(comments);
    } catch (err) {
        return res.status(400).json(err.message);
    }
}]);

// @route    GET posts/:id/reply
// @desc     GET replies from post id
// @access   Public
router.get('/:id/reply', [pub, async (req, res) => {
    try {
        const comments = await Comment.findOne({_id: req.params.id})
            .select('childComments')
            .populate({
                path: 'childComments',
                populate: {path: 'user', select: 'username name profile'}
            });
        return res.json(comments);
    } catch (err) {
        return res.status(400).json(err.message);
    }
}]);

//authenticated routes below this middleware
router.use(auth);

router.delete('/:id', [
    PostValidation.delete,
    async (req, res) => {
        try {
            const post = await Post.findOneAndDelete({
                _id: req.params.id,
                user: req.decoded._id
            }).lean();
            if (!post) {
                return res.status(404).json({success: false, message: 'Post not found'});
            }

            const board = await Board.updateMany(
                {
                    posts: req.params.id
                },
                {pull: {posts: req.body.post}}
            ).lean();
            if (!board) {
                return res.status(404).json({success: false, message: 'Board not found'});
            }

            return res.status(204).json({});
        } catch (err) {
            return res.status(400).json({success: false, err});
        }
    }
]);
// @route    PUT posts/:id/comment
// @desc     PUT comments from post id
// @access   Private
router.put('/:id/comment', async (req, res) => {
    try {
        const comment = await Comment.create({user: req.decoded._id, comment: req.body.comment});
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $addToSet: {comments: comment}
        });
        return res.json(post);
    } catch (err) {
        return res.status(400).json({error: err.message});
    }
});

// @route    Delete posts/comment/:CommentID
// @desc     Delete comment from comment id
// @access   Private
router.delete('/comment/:commentID', async (req,res) => {
    try {
        const comment = await Comment.findOneAndDelete({ $and: [{_id: req.params.commentID}, {user: req.decoded._id}]});
        if(!comment) {
            throw new Error('You do not have authorization to delete this comment');
        }
        return res.json({message: 'The comment has been succesfully deleted'});
        
    } catch (err) {
        return res.status(400).json({error: err.message});
    }
});

// @route    PUT posts/comment/:CommentID
// @desc     PUT reply to parent comment id
// @access   Private
router.put('/:id/reply', async (req,res) => {
    try {
        const reply = await Comment.create({user: req.decoded._id, comment: req.body.comment, parentComment: req.params.id});
        await Comment.findByIdAndUpdate(req.params.id, {
            $addToSet: {childComments: reply}
        });
        return res.json(reply);
    } catch (err) {
        return res.status(400).json({error: err.message});
    }
});

module.exports = router;
