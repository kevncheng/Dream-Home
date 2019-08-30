const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userValidator = require('./validate/user');
const UserClass = require('../services/user');
const uniqueValidator = require('mongoose-unique-validator');

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: userValidator.name
    },
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        validate: userValidator.username
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        validate: userValidator.email
    },
    password: {
        type: String,
        required: true,
        validate: userValidator.password
    },
    profile: {
        type: String,
        required: false
    },
    interests: {
        type: [String]
    },
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    }]
});

user.virtual('boards', {
    ref: 'boards',
    localField: '_id',
    foreignField: 'user'
});

user.virtual('posts', {
    ref: 'posts',
    localField: '_id',
    foreignField: 'user'
});

user.pre('save', function (next) {
    let user = this;

    if (!this.isModified ('password')) {
        next ();
    }

    bcrypt.hash (user.password, 10, function (err, hash) {
        user.password = hash;
        next ();
    });
});

user.set('toObject', { virtuals: true });
user.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });
user.loadClass(UserClass);
module.exports = mongoose.model('users', user, 'users');
