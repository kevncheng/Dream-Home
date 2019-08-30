const decodeUser = require ('./token');

module.exports = (req, res, next) => {
    const token = req.body.token || req.body.query || req.headers['access-token']; // Check for token in body, URL, or headers
    if (!token) {
        return res.status (401).json ({ success: false, message: 'No token provided' });
    }

    req.decoded = decodeUser (token, res);
    return next ();
};
