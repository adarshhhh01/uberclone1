const mongoose = require('mongoose')

const blacklistTokenSchema = new mongoose.Schema({
    token :{
        type: String,
        required: true,
        unique: true

    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: '24h' // Token will be automatically removed after 24 hours
        // this ensures that the blacklist doesn't grow indefinitely and old tokens are removed after they expire
        //TTL index is created on createdAt field, so that documents will be automatically deleted after the specified time (24 hours in this case)
    }
})
    
module.exports =  mongoose.model('BlacklistToken', blacklistTokenSchema);