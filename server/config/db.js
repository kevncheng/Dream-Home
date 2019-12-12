const mongoose = require('mongoose');
require('dotenv').config();
const db = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
        console.log('MongoDB connected');
    } catch (err) {
        console.log(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;