const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'posts'
        }
    ],
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('boards', BoardSchema, 'boards');
