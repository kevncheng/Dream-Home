const express = require('express');
const router = express.Router();

const UserValidation = require('./validate/user');
const {User, Board, Post, Follow} = require('../models');
const upload = require('../services/file-upload');
const {auth, pub} = require('../middleware');

router.get('/', [
    pub,
    async (req, res) => {
        try {
            const user = await User.findById(req.decoded._id).select('-password');
            res.json(user);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    }
]);

// @route    POST users/register
// @desc     register
// @access   Public
router.post('/register', [
    UserValidation.register,
    async (req, res) => {
        try {
            const user = await User.create(req.body);
            return res.status(201).json({
                success: true,
                user: {...user.toObject(), followers: 0, following: 0},
                token: user.loginToken()
            });
        } catch (err) {
            return res.status(400).json({success: false, message: err.errors});
        }
    }
]);

// @route    POST users/login
// @desc     login
// @access   Public
router.post('/login', [
    UserValidation.login,
    pub,
    async (req, res) => {
        const user = await User.findOne({email: req.body.email})
            // .populate({path: 'posts', populate: {path: 'user', select: 'username name profile'}})
            // // .populate({ path: 'favourites', populate: { path: 'user', select: 'username name profile' } })
            .populate({
                path: 'boards',
                select: '-posts'
            })
            .exec();
        if (!user) {
            return res.status(400).json({success: false, message: 'Could not authenticate'});
        } else {
            const validPassword = await user.comparePassword(req.body.password);
            if (!validPassword) {
                res.status(400).json({success: false, message: 'Could not authenticate'});
            } else {
                return res.status(200).json({
                    success: true,
                    user: {...user.toObject(), password: '', ...(await user.follow())},
                    token: user.loginToken()
                });
            }
        }
    }
]);

// @route    GET users/:username
// @desc     Get user profile with all their posts and boards
// @access   Public
router.get('/:username', [
    pub,
    async (req, res) => {
        try {
            const currentUser = req.query.isCurrentUser === 'true';
            let populateQuery = [
                {
                    path: 'posts',
                    populate: {path: 'user', select: 'username name profile'}
                },
                {
                    path: 'boards',
                    populate: {path: 'posts', select: '_id image'}
                }
            ];
            if (currentUser) {
                populateQuery.push({
                    path: 'favourites',
                    populate: {path: 'user', select: 'username name profile'}
                });
            }
            const selectQuery = currentUser ? '-password' : '-password -favourites';
            const user = await User.findOne({username: req.params.username})
                .select(selectQuery)
                .populate(populateQuery)
                .exec();
            if (!user) {
                return res.status(404).json({success: false, message: 'User not found'});
            }
            return res
                .status(200)
                .json({success: true, user: {...user.toObject(), ...(await user.follow())}});
        } catch (err) {
            return res.status(400).json({success: false, message: err});
        }
    }
]);

//authenticated routes below this middleware
router.use(auth);

// @route    PUT users/:username
// @desc     Update user image and/or name
// @access   Private
router.put('/:username', [
    upload.single('image'),
    UserValidation.updateUser,
    async (req, res) => {
        let update = {};
        if (req.file) {
            update.profile = req.file.location;
        }
        if (req.body.name) {
            update.name = req.body.name;
        }
        try {
            const user = await User.findOneAndUpdate({username: req.params.username}, update, {
                new: true
            })
                .select('-password')
                .lean();
            if (!user) {
                return res.status(404).json({success: false, message: 'User not found'});
            }
            return res.status(200).json({success: true, user});
        } catch (err) {
            return res.status(400).json({err});
        }
    }
]);

// @route    POST users/follow
// @desc     Follow another user
// @access   Private
router.post('/follow', [
    UserValidation.followUser,
    async (req, res) => {
        if (req.decoded._id === req.body.followee) {
            return res.status(403).json({success: false, message: 'You can not follow yourself'});
        }

        try {
            const follow = {...req.body, follower: req.decoded._id};
            await Follow.findOneAndUpdate(follow, follow, {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }).lean();
            return res.status(200).json({success: true});
        } catch (err) {
            return res.status(400).json({success: false});
        }
    }
]);

// @route    POST users/unfollow
// @desc     unfollow user
// @access   Private
router.post('/unfollow', [
    UserValidation.unfollowUser,
    async (req, res) => {
        if (req.decoded._id === req.body.followee) {
            return res.status(403).json({success: false, message: 'You can not unfollow yourself'});
        }

        try {
            await Follow.findOneAndRemove({...req.body, follower: req.decoded._id}).lean();
            return res.status(200).json({success: true});
        } catch (err) {
            return res.status(400).json({success: false});
        }
    }
]);

// @route    GET users/:id/following
// @desc     get users who are following specified user
// @access   Private
router.get('/:id/following', async (req, res) => {
    try {
        const following = await User.following(req.params.id);
        return res.status(200).json({success: true, following});
    } catch (err) {
        return res.status(400).json({success: false});
    }
});

// @route    GET users/:id/followers
// @desc     get specified user's followers
// @access   Private
router.get('/:id/followers', async (req, res) => {
    try {
        const followers = await User.followers(req.params.id);
        return res.status(200).json({success: true, followers});
    } catch (err) {
        return res.status(400).json({success: false});
    }
});

// TODO: add to board route ?
// @route    POST users/:username/board
// @desc     Create user board
// @access   Private
router.post('/:username/board', [
    UserValidation.addBoard,
    async (req, res) => {
        try {
            const user = await User.findOne({username: req.params.username})
                .select('_id')
                .lean();
            if (!user) {
                return res.status(404).json({success: false, message: 'no user found'});
            }
            const board = await Board.create({
                title: req.body.title,
                user: user._id
            });
            return res.status(201).json({success: true, board});
        } catch (err) {
            return res.status(400).json({success: false, message: err.errmsg});
        }
    }
]);

// TODO: add to post route ?
// @route    POST users/:username/posts
// @desc     Create new post
// @access   Private
router.post('/:username/posts', [
    upload.single('image'),
    UserValidation.addPost,
    async (req, res) => {
        if (req.decoded.username !== req.params.username) {
            return res
                .status(403)
                .json({success: false, message: 'Cannot create posts for other users'});
        }

        const user = await User.findOne({username: req.params.username})
            .select('_id')
            .lean();

        if (!user) {
            return res.status(404).json({success: false, message: 'no user found'});
        }
        if (req.file) {
            try {
                const post = await Post.create({
                    title: req.body.title,
                    link: req.body.link,
                    description: req.body.description,
                    tags: req.body.tags.split(','),
                    user: user._id,
                    image: req.file.location
                });
                return res.status(201).json({success: true, post});
            } catch (err) {
                return res.status(400).json({err});
            }
        } else {
            return res.status(400).json({success: false, message: 'no file provided'});
        }
    }
]);

// @route    POST users/:username/favourite
// @desc     Add post to user's favourites
// @access   Private
router.post('/:username/favourite', [
    UserValidation.addPostToFavourites,
    async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.decoded._id, {
                $addToSet: {favourites: req.body.post}
            })
                .select('-password')
                .lean();
            if (!user) {
                return res.status(404).json({success: false, message: 'User not found'});
            }

            res.status(201).json({success: true, user});
        } catch (err) {
            return res.status(400).json({success: false, err});
        }
    }
]);

// @route    POST users/:username/favourite
// @desc     Add post to user's favourites
// @access   Private
router.post('/:username/unfavourite', [
    UserValidation.removePostFromFavourites,
    async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.decoded._id, {
                $pullAll: {favourites: [req.body.post]}
            })
                .select('-password')
                .lean();
            if (!user) {
                return res.status(404).json({success: false, message: 'User not found'});
            }

            res.status(200).json({success: true, user});
        } catch (err) {
            return res.status(400).json({success: false, err});
        }
    }
]);

// @route    PUT users/:username/interests
// @desc     Update user interests
// @access   Private
router.put('/:username/interests', async (req, res) => {
    try {
        let user = await User.findOne({username: req.params.username});
        if (user._id.toString() !== req.decoded._id.toString()) {
            return res.status(401).json({msg: 'You do not have the authorization to do this'});
        }
        if (!user) {
            return res.status(404).json({msg: 'User not found'});
        }
        user.interests = req.body.interests;
        await user.save();
        res.json(user);
    } catch (err) {
        // Check to see if it is a valid object id
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'The user does not exist'});
        }
        return res.status(500).send('Server Error');
    }
});

module.exports = router;
