const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = process.env.MONGO_URI;
const uri = process.env.NODE_ENV === 'dev' ? process.env.MONGO_URI + '/pineapple' : process.env.MONGO_URI + '/test';

if(!process.env.MONGO_URI) {
    throw new Error('No Mongo URI provided in environment');
} else {
    mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    // eslint-disable-next-line no-console
        .then(() => console.log('MongoDB successfully connected'))
        // eslint-disable-next-line no-console
        .catch(err => console.log(err));
}

// const connectDB = async () => {
//     try {
//         await mongoose.connect(db);
//         console.log('MongoDB connected');
//     } catch (err) {
//         console.log(err.message);
//         // Exit process with failure
//         process.exit(1);
//     }
// };

// module.exports = connectDB;