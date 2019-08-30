module.exports = (req, res, next) => {
    let errors = req.validationErrors();
    if (!errors) {
        next();
    } else {
        res.status(422).json({ success: false, errors });
    }
};