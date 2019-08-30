const decodeUser = require ('./token');

module.exports = (req, res, next) => {
    const token = req.body.token || req.body.query || req.headers['access-token']; // Check for token in body, URL, or headers

    if (token) {
        req.decoded = decodeUser (token, res);
    }

    return next ();
};

