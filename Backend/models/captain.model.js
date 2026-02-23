const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const captainSchema = new mongoose.Schema({
    fullName:{
        firstName:{
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long']
        },
        lastName:{
            type: String,
            // minlength: [3, 'Last name must be at least 3 characters long']
        }},
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address.']
    },
    password:{
        type: String,
        required: true,
        select : false // if you find a user and want to include the password, you have to explicitly ask for it with .select('+password')
    },
    socketId:{
        type: String,
    }, 
    status:{
        type: String,
        enum: ['available', 'unavailable'],
        default: 'unavailable'
    },
    onlineSince: {
        type: Date,
        default: null
    },
    totalOnlineSeconds: {
        type: Number,
        default: 0,
        min: 0
    },
    vehicleDetails:{
        color:{
            type: String,
            required: true
        },
        plate:{
            type: String,
            required: true,
            unique: true
        },
        vehicleType:{
            type: String,
            required: true,
            enum: ['car', 'moto', 'auto']
        } ,
        capacity:{
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1'],
            max: [7, 'Capacity cannot exceed 7']
        },
    },
    location:{
         type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
    },
    coordinates: {
        type: [Number], // [lng, lat]
        default: [0, 0]
    }
    }
   
        
})

captainSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;

}

captainSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function(password)
{
    return await bcrypt.hash(password,10);  
}

captainSchema.index({ location: '2dsphere' });

const captainModel = mongoose.model('Captain', captainSchema);
module.exports = captainModel;
