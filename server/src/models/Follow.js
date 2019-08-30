const mongoose = require ('mongoose');

const follow = new mongoose.Schema ({
    followee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        index: true,
        required: true
    },
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        index: true,
        required: true
    },
    start: {
        type: Date,
        default: Date.now
    },
    end: {
        type: Date,
        default: ''
    }
});

module.exports = mongoose.model ('follow', follow);
