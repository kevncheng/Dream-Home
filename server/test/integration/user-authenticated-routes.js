const { User, Follow, Board, Post } = require ('../../src/models');
const { request, authentication_setup, addBoardandPost, addUser } = require ('../utils/common');

const chai = require('chai');
const expect = chai.expect;

describe('User Authenticated Routes', () => {
    before(async() => {
        const { token, id, user } = await authentication_setup ();
        await addBoardandPost(id);
        global.user2 = await addUser ();
        global.token = token;
        global._id = id;
        global.user = user;
    });

    after(async () => {
        User.collection.drop();
        Follow.collection.drop ();
        Board.collection.drop ();
        Post.collection.drop ();
    });

    describe('Update profile', () => {
        it('Should need return unauthorized', () => {
            return request
                .put('/users/test')
                .expect(401)
                .then((res) => {
                    expect(res.body.success).to.be.false;
                });
        }).timeout(10000);

        //need abs path to file
        it.skip('Should return valid', () => {
            return request
                .put('/users/test')
                .set({ 'access-token': global['token'] })
                .attach('image', '/Users/nick/Desktop/team-pineapple/server/test/utils/test-data/kenny.png')
                .expect(200)
                .then((res) => {
                    expect(res.body.user.profile).to.be.not.empty;
                    expect(res.body.success).to.be.true;
                });
        }).timeout(10000);

        it('Should return valid (no image)', () => {
            return request
                .put('/users/test')
                .set({ 'access-token': global['token'] })
                .field('name', 'test')
                .expect(200)
                .then((res) => {
                    expect(res.body.user.name).to.be.equal('test');
                    expect(res.body.success).to.be.true;
                });
        }).timeout(10000);
    });

    describe('Get user boards and posts', () => {
        it ('Should need return authorized', () => {
            return request
                .get('/users/test')
                .expect (200)
                .then((res) => {
                    expect (res.body.success).to.be.true;
                });
        });

        //need abs path to file
        it('Should return valid', () => {
            return request
                .get('/users/test')
                .set({ 'access-token': global['token'] })
                .expect(200)
                .then((res) => {
                    expect(res.body.user.boards[0].title).to.be.equal('test board');
                    expect(res.body.user.posts[0].title).to.be.equal('test');
                    expect (res.body.user.favourites[0].title).to.be.equal ('test');
                    expect(res.body.success).to.be.true;
                });
        });

        it('Should return no user', () => {
            return request
                .get('/users/temp')
                .set({ 'access-token': global['token'] })
                .field('name', 'test')
                .expect(404)
                .then((res) => {
                    expect(res.body.success).to.be.false;
                });
        });
    });

    describe ('Follow another user', () => {
        it ('Should return unauthorized', () => {
            return request
                .post ('/users/follow')
                .set ({ 'access-token': global['token'] })
                .send ({
                    'followee': global._id
                })
                .expect (403)
                .then ((res) => {
                    expect (res.body.success).to.be.false;
                });
        });

        it ('Should return missing fields', () => {
            return request
                .post ('/users/follow')
                .set ({ 'access-token': global['token'] })
                .send ({})
                .expect (422)
                .then ((res) => {
                    expect (res.body.success).to.be.false;
                });
        });

        it ('Should return error', () => {
            return request
                .post ('/users/follow')
                .set ({ 'access-token': global['token'] })
                .send ({
                    'followee': global._id
                })
                .expect (403)
                .then ((res) => {
                    expect (res.body.success).to.be.false;
                });
        });

        it ('Should return valid', async () => {
            await request
                .post ('/users/follow')
                .set ({ 'access-token': global['token'] })
                .send ({
                    'followee': global.user2
                })
                .expect (200)
                .then ((res) => {
                    expect (res.body.success).to.be.true;
                });

            const temp = await global.user.follow();
            expect (temp.following).to.be.equal (1);
        });
    });

    describe ('unFollow another user', () => {
        it ('Should return unauthorized', () => {
            return request
                .post ('/users/unfollow')
                .set ({ 'access-token': global['token'] })
                .send ({
                    'followee': global._id
                })
                .expect (403)
                .then ((res) => {
                    expect (res.body.success).to.be.false;
                });
        });

        it ('Should return missing fields', () => {
            return request
                .post ('/users/unfollow')
                .set ({ 'access-token': global['token'] })
                .send ({})
                .expect (422)
                .then ((res) => {
                    expect (res.body.success).to.be.false;
                });
        });

        it ('Should return error', () => {
            return request
                .post ('/users/unfollow')
                .set ({ 'access-token': global['token'] })
                .send ({
                    'followee': global._id
                })
                .expect (403)
                .then ((res) => {
                    expect (res.body.success).to.be.false;
                });
        });

        it ('Should return valid', async () => {
            await request
                .post ('/users/unfollow')
                .set ({ 'access-token': global['token'] })
                .send ({
                    'followee': global.user2
                })
                .expect (200)
                .then ((res) => {
                    expect (res.body.success).to.be.true;
                });

            const temp = await global.user.follow();
            expect (temp.following).to.be.equal (0);
        });
    });
});
