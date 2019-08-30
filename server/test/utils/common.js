require('dotenv').config();
const { User, Board, Post } = require('../../src/models');
const app = require('../../app');
let request = require('supertest')(app);

module.exports = {
    login: (user) => {
        return request
            .post('/users/login')
            .send(user);
    },
    authentication_setup: async () => {
        const user = await User.create({
            name: 'test user',
            username: 'test',
            email: 'test@gmail.com',
            password: 'Password1'
        });

        return { token: user.loginToken (), id: user._id, user };
    },
    addBoardandPost: async (id) => {
        const board = await Board.create ({
            title: 'test board',
            user: id
        });
        const post = await Post.create ({
            title: 'test',
            description: 'test post',
            link: 'test link',
            tags: [],
            user: id,
            image: 'test image'
        });

        await User.findByIdAndUpdate(id, { '$addToSet': { favourites: post._id } }).lean();

        return { board, post };
    },
    addPostToBoard: async (id) => {
        const post = await Post.create ({
            title: 'valid',
            description: 'valid post',
            link: 'valid link',
            tags: [],
            user: id,
            image: 'image'
        });

        const board = await Board.create ({
            title: 'valid board',
            user: id,
            posts: [post._id]
        });

        return { board, post };
    },
    addUser: async () => {
        const user = await User.create ({
            name: 'test user',
            username: 'testing123',
            email: 'testing123@gmail.com',
            password: 'Password2'
        });

        return user._id;
    },
    getBoard: async (id) => {
        return await Board.findById(id).lean();
    },
    request
};
