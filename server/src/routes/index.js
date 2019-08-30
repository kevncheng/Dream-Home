const express = require('express');
const router = express.Router();

router.use('/users', require('./user'));
router.use('/posts', require('./posts'));
router.use('/boards', require('./board'));

module.exports = router;

