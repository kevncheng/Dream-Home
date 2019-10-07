const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {User, Post, Board} = require('../models');
const {auth, pub} = require('../middleware');
const PostValidation = require('./validate/post');

const _ = require('lodash');

// @route    GET users/posts
// @desc     Get all posts based on user's interests or filter
// @access   Public
router.get('/', [
    pub,
    async (req, res) => {
        const {search_filter = '', easy_filters = '', userId = '', size = 20} = req.query;
        try {
            let query;
            let searchTags = [];

            if (search_filter) {
                searchTags = [...searchTags, search_filter];
            }
            if (easy_filters) {
                searchTags = [...searchTags, ...easy_filters.split(',')];
            }
            // If logged in with empty search
            if (_.isEmpty(searchTags) && userId) {
                // Get user's interest and add interest into search tags
                const user = await User.findById(mongoose.Types.ObjectId(userId));
                searchTags = [...searchTags, ...user.interests];
                query = {tags: {$in: user.interests}};
            }
            // Search by filters if present
            else if (!_.isEmpty(searchTags)) {
                query = {tags: {$all: searchTags}};
                // If not logged in will return a bunch of posts
            } else {
                query = {};
            }
            const posts = await Post.find(query)
                .limit(parseInt(size))
                .sort({$natural: -1})
                .populate({path: 'user', select: 'username name profile'})
                .lean();
            const postsSize = await Post.find(query).count();
            res.send({posts, postsSize});
        } catch (err) {
            res.status(500).send('Something went wrong with the server');
        }
    }
]);

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

module.exports = router;
