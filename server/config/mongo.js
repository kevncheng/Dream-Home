const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uri = process.env.NODE_ENV === 'dev' ? process.env.MONGO_URI + '/pineapple' : process.env.MONGO_URI + '/test';

if(!process.env.MONGO_URI) {
    throw new Error('No Mongo URI provided in environment');
} else {
    mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    // eslint-disable-next-line no-console
        .then(() => console.log('MongoDB successfully connected'))
        // eslint-disable-next-line no-console
        .catch(err => console.log(err));
}

