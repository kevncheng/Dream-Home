const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        // ref to user model
        ref: 'users',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    link: {
        type: String
    },
    tags: {
        type: [String]
    },
    image: {
        type: String,
        required: true
    },
    comments: [{type: Schema.Types.ObjectId, ref: 'comment'}],
    date: {
        type: Date,
        default: Date.now
    }
});

PostSchema.virtual('users', {
    ref: 'users',
    localField: '_id',
    foreignField: 'user'
});

// PostSchema.virtual('comment', {
//     ref: 'comment',
//     localField: '_id',
//     foreignField: 'comments'
// });

module.exports = mongoose.model('posts', PostSchema, 'posts');
