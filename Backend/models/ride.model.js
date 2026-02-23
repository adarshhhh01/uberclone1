const mongoose = require('mongoose');


const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain',
    },
    pickup: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    pickupCoordinates: {
        lat: Number,
        lng: Number
    },
    destinationCoordinates: {
        lat: Number,
        lng: Number
    },
    fare: {
        type: Number,
        required: true,
    },
    vehicleType: {
        type: String,
        enum: ['auto', 'car', 'moto']
    },

    status: {
        type: String,
        enum: [ 'pending', 'accepted', "ongoing", 'completed', 'cancelled' ],
        default: 'pending',
    },

    duration: {
        type: Number,
    }, // in seconds

    distance: {
        type: Number,
    }, // in meters
    coveredDistanceMeters: {
        type: Number,
        default: 0
    },
    cancellationCharge: {
        type: Number,
        default: 0
    },
    cancelledBy: {
        type: String,
        enum: ['user', 'captain']
    },
    cancellationReason: {
        type: String
    },

    paymentID: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },

    otp: {
        type: String,
        select: false,
        required: true,
    },
})

module.exports = mongoose.model('ride', rideSchema);
