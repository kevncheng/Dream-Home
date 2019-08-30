const validate = require('mongoose-validator');

module.exports = {
    name: [
        validate({
            validator: 'isLength',
            arguments: [3, 20],
            message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
        })
    ],
    email : [
        validate({
            validator: 'isEmail',
            message: 'Email is not vaild'
        }),
        validate({
            validator: 'isLength',
            arguments: [3, 50],
            message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
        })
    ],
    username : [
        validate({
            validator: 'isLength',
            arguments: [3, 25],
            message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
        }),
        validate({
            validator: 'isAlphanumeric',
            message: 'Username must contain letters and numbers only'
        })
    ],
    password : [
        validate({
            validator: 'isLength',
            arguments: [8, 100],
            message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
        })
    ]
};
