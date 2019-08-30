const { User }  = require('../../src/models');
const { request, authentication_setup } = require('../utils/common');

const chai = require('chai');
const expect = chai.expect;

describe('User Board Routes', () => {
    before(async() => {
        const {token} = await authentication_setup();
        global.token = token;
    });

    after(async () => {
        User.collection.drop();
    });

    describe('Create User Board', () => {
        it('Should return valid', () => {
            return request
                .post('/users/test/board')
                .set({ 'access-token': global['token'] })
                .send({
                    'title': 'test board'
                })
                .expect(201)
                .then((res) => {
                    expect(res.body.success).to.be.true;
                    expect(res.body.board.title).to.be.equal('test board');
                });
        });

        it('Should return no user', () => {
            return request
                .post('/users/temp/board')
                .set({ 'access-token': global['token'] })
                .send({
                    'title': 'test board',
                })
                .expect(404)
                .then((res) => {
                    expect(res.body.success).to.be.false;
                });
        });

        it('Should return invalid', () => {
            return request
                .post('/users/test/board')
                .set({ 'access-token': global['token'] })
                .send({
                    'title': '',
                })
                .expect(422)
                .then((res) => {
                    expect(res.body.success).to.be.false;
                });
        });
    });
});