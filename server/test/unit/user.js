const chai = require("chai");
const expect = chai.expect;

const { User } = require ('../../src/models');
const importUsers = require ('../utils/test-data/users');

describe('User', () => {
    before (async function () {
        this.timeout (5000);
        require('dotenv').config();
        require('../../config/mongo');
        global.users = await importUsers ();
    });

    after (() => {
        User.collection.drop ();
    });

    describe ('Pre Save', () => {
        it('Should create new user',async() => {
            const user = await User.create({
                'name': 'temp7',
                'username': 'temp7',
                "password": "Password1",
                'email': 'temp7@gmail.com'
            });
            expect(await user.comparePassword('Password1')).to.be.true;
        });

        it('Should return error',async() => {
            try {
                await User.create({
                    "name": "temp",
                    "username": "temp",
                    "password": "",
                    "email": "temp@gmail.com",
                });
            } catch(err) {
                expect(err).to.not.be.empty;
            }
        });
    });

    describe('Password Verification', () => {
        it('Should match',async () => {
            const user = await User.create({
                'name': 'temp123',
                'username': 'temp123',
                "password": "Password1",
                'email': 'temp123@gmail.com'
            });

            expect(await user.comparePassword('Password1')).to.be.true;
            expect(await user.comparePassword('Password2')).to.be.false;
        });

        it('Password Salts are random',async () => {
            const user1 = await User.create({
                "name": "temp9",
                "username": "temp9",
                "password": "Password1",
                "email": "temp9@gmail.com",
            });

            const user2 = await User.create({
                "name": "temp10",
                "username": "temp10",
                "password": "Password1",
                "email": "temp10@gmail.com",
            });

            expect(user1.password).to.not.be.equal(user2.password);
        });
    });

    describe ('Follow User', () => {
        it ('Should return following and followers', async () => {
            const eric = await global.users[0].follow ();
            expect (eric.following).to.be.equal (1);
            expect (eric.followers).to.be.equal (0);

            const kenny = await global.users[1].follow ();
            expect (kenny.following).to.be.equal (2);
            expect (kenny.followers).to.be.equal (3);
        });

        it ('Should return list of users following Kenny', async () => {
            const kenny_followers = await User.followers (global.users[1]._id);
            expect (kenny_followers[0].username).to.be.equal (global.users[0].username);
            expect (kenny_followers[1].username).to.be.equal (global.users[2].username);
            expect (kenny_followers[2].username).to.be.equal (global.users[3].username);
        });

        it ('Should return list of users Kenny is following', async () => {
            const kenny_following = await User.following (global.users[1]._id);
            expect (kenny_following[0].username).to.be.equal (global.users[2].username);
            expect (kenny_following[1].username).to.be.equal (global.users[3].username);
        });
    });
});
