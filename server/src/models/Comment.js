const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    childComments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('comment', CommentSchema, 'comment');