const validationHandler = require('./handler');

module.exports = {
    register : (req, res, next) => {
        req.checkBody('name', 'no name provided').exists().notEmpty();
        req.checkBody('username', 'No username provided').exists().notEmpty();
        req.checkBody('email', 'No email provided').exists().notEmpty();
        req.checkBody('password', 'No password provided').exists().notEmpty();

        validationHandler(req, res, next);
    },

    login: (req, res, next) => {
        req.checkBody('email', 'No email provided').exists().notEmpty();
        req.checkBody('password', 'No password provided').exists().notEmpty();

        validationHandler(req, res, next);
    },

    addPost: (req, res, next) => {
        req.checkBody('board', 'No board provided').optional();
        req.checkBody('title', 'No title provided').exists().notEmpty();
        req.checkBody('description', 'No description provided').exists().notEmpty();
        req.checkBody('link', 'No link provided').exists().notEmpty();
        req.checkBody('tags', 'No tags provided').exists();

        validationHandler(req, res, next);
    },

    updateUser : (req, res, next) => {
        req.checkParams('username', 'no username provided').exists().notEmpty();
        req.checkBody('name', 'no name provided').optional();
      
        validationHandler(req, res, next);
    },
  
    addBoard: (req, res, next) => {
        req.checkBody('title', 'No title provided').exists().notEmpty();

        validationHandler (req, res, next);
    },

    followUser: (req, res, next) => {
        req.checkBody ('followee', 'No followee provided').exists ().isMongoId ();

        validationHandler (req, res, next);
    },

    unfollowUser: (req, res, next) => {
        req.checkBody ('followee', 'No followee provided').exists ().isMongoId ();

        validationHandler (req, res, next);
    },

    addPostToFavourites: (req, res, next) => {
        req.checkBody ('post', 'No Post provided').exists ().isMongoId ();

        validationHandler (req, res, next);
    },

    removePostFromFavourites: (req, res, next) => {
        req.checkBody ('post', 'No Post provided').exists ().isMongoId ();

        validationHandler(req, res, next);
    },
};
