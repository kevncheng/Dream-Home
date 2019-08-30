const validationHandler = require ('./handler');

module.exports = {
    getPosts: (req, res, next) => {
        req.checkParams('id', 'No board id provided').exists().isMongoId();

        validationHandler(req, res, next);
    },

    removePost: (req, res, next) => {
        req.checkParams('id', 'No id provided').exists().isMongoId();
        req.checkBody('post', 'No post provided').exists().isMongoId();

        validationHandler (req, res, next);
    },

    delete: (req, res, next) => {
        req.checkParams ('id', 'No id provided').exists ().isMongoId ();

        validationHandler (req, res, next);
    }
};
