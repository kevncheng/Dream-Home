const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let uri = '';
if(process.env.NODE_ENV === 'dev') {
    uri = process.env.MONGO_URI;
} else if(process.env.NODE_ENV === 'prod') {
    uri = process.env.MONGODB_URI;
} else {
    uri = process.env.MONGO_URI + '/test';
}

if(!uri) {
    throw new Error('No Mongo URI provided in environment');
} else {
    mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    // eslint-disable-next-line no-console
        .then(() => console.log('MongoDB successfully connected'))
        // eslint-disable-next-line no-console
        .catch(err => console.log(err));
}
