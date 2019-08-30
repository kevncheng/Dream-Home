const jwt = require('jsonwebtoken');

module.exports = (token, res) => {
    try {
        return jwt.verify (token, process.env.SECRET);
    } catch (err) {
        return res.status (403).json ({ success: false, message: 'Token invalid' });
    }
};
