const mongoose = require('mongoose');

 
async function connectDB(){
    const dbUri = process.env.DB_CONNECT
    if (!dbUri) {
        throw new Error('DB_CONNECT is missing in environment variables')
    }

    await mongoose.connect(dbUri)
    console.log(`CONNECTED TO DATABASE`)
}

module.exports = connectDB;
