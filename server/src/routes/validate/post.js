const validationHandler = require ('./handler');

module.exports = {
    delete: (req, res, next) => {
        req.checkParams ('id', 'No id provided').exists ().isMongoId ();

        validationHandler (req, res, next);
    }
};
