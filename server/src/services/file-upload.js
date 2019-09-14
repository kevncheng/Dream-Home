const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.REGION
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
    }
};

const upload = multer({
    fileFilter,
    storage: multerS3({
        s3: new aws.S3(),
        bucket: 'dreamhomenetwork',
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
});

module.exports = upload;