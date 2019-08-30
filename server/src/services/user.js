const mongoose = require ('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Follow = require ('../models/Follow');

class UserClass {
    async comparePassword(password) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (err) {
            return false;
        }
    };

    loginToken() {
        return jwt.sign({
            _id: this._id,
            username: this.username,
        }, process.env.SECRET, { expiresIn: '24hr' });
    };

    async follow () {
        try {
            const count = await Follow.aggregate ([
                {
                    $facet: {
                        'following': [
                            { $match: { follower: this._id } },
                            {
                                $group: {
                                    _id: '$follower',
                                    count: { $sum: 1 }
                                }
                            }
                        ],
                        'followers': [
                            { $match: { followee: this._id } },
                            {
                                $group: {
                                    _id: 'followee',
                                    count: { $sum: 1 }
                                }
                            }
                        ]
                    }
                },
                {
                    $project: {
                        following: { $ifNull: [{ $arrayElemAt: ['$following.count', 0] }, 0] },
                        followers: { $ifNull: [{ $arrayElemAt: ['$followers.count', 0] }, 0] }
                    }
                }
            ]);
            return count[0];
        } catch (e) {
            throw(e);
        }
    }

    static async following (id) {
        try {
            return await Follow.aggregate ([
                { $match: { follower: mongoose.Types.ObjectId (id) } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'followee',
                        foreignField: '_id',
                        as: 'following'
                    }
                },
                { $unwind: '$following' },
                {
                    $project: {
                        _id: '$following._id',
                        username: '$following.username',
                        name: '$following.name',
                        profile: '$following.profile'
                    }
                }
            ]);
        } catch (e) {
            throw(e);
        }
    }

    static async followers (id) {
        try {
            return await Follow.aggregate ([
                { $match: { followee: mongoose.Types.ObjectId (id) } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'follower',
                        foreignField: '_id',
                        as: 'followers'
                    }
                },
                { $unwind: '$followers' },
                {
                    $project: {
                        _id: '$followers._id',
                        username: '$followers.username',
                        name: '$followers.name',
                        profile: '$followers.profile'
                    }
                }
            ]);
        } catch (e) {
            throw(e);
        }
    }
}

module.exports = UserClass;
