const rideService = require('../services/ride.services');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');

const sanitizeRideForCaptain = rideDoc => {
    if (!rideDoc) return null;
    const ride = rideDoc.toObject ? rideDoc.toObject() : { ...rideDoc };
    delete ride.otp;
    return ride;
};

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        const rideResponse = sanitizeRideForCaptain(ride);
        res.status(201).json(rideResponse);

        try {
            const pickupCoordinates = ride.pickupCoordinates || await mapService.getAddressCoordinate(pickup);
            const initialRadius = Number(process.env.CAPTAIN_SEARCH_RADIUS_KM || 5);

            let captainsInRadius = await mapService.getCaptainsInTheRadius(
                pickupCoordinates.lat,
                pickupCoordinates.lng,
                initialRadius
            );

            if (!captainsInRadius.length) {
                captainsInRadius = await mapService.getNearestAvailableCaptains(
                    pickupCoordinates.lat,
                    pickupCoordinates.lng,
                    15000
                );
            }

            const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
            const captainRidePayload = sanitizeRideForCaptain(rideWithUser);

            captainsInRadius.forEach(captain => {

                sendMessageToSocketId(captain.socketId, {
                    event: 'new-ride',
                    data: captainRidePayload
                })
            })
        } catch (dispatchError) {
            console.error('Ride created but captain dispatch failed:', dispatchError.message);
        }

    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }

};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        const captainRidePayload = sanitizeRideForCaptain(ride);
        return res.status(200).json(captainRidePayload);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        if (err.message === 'Ride id and OTP are required' || err.message === 'Invalid OTP') {
            return res.status(400).json({ message: err.message });
        }
        if (err.message === 'Ride not found') {
            return res.status(404).json({ message: err.message });
        }
        if (err.message === 'Ride not accepted') {
            return res.status(409).json({ message: err.message });
        }
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } 
}; 

module.exports.cancelRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, reason } = req.body;

    try {
        const ride = await rideService.cancelRide({ rideId, captain: req.captain, reason });

        sendMessageToSocketId(ride.user?.socketId, {
            event: 'ride-cancelled',
            data: {
                rideId: ride._id,
                status: ride.status,
                cancellationCharge: ride.cancellationCharge || 0,
                coveredDistanceKm: Number(((ride.coveredDistanceMeters || 0) / 1000).toFixed(2)),
                message: 'Captain cancelled the ride',
                ride
            }
        });

        const captainRidePayload = sanitizeRideForCaptain(ride);
        return res.status(200).json(captainRidePayload);
    } catch (err) {
        if (err.message === 'Ride not found') {
            return res.status(404).json({ message: err.message });
        }
        if (err.message === 'Ride cannot be cancelled now') {
            return res.status(409).json({ message: err.message });
        }
        return res.status(500).json({ message: err.message });
    }
};

module.exports.getCurrentRide = async (req, res) => {
    try {
        const ride = await rideModel.findOne({
            captain: req.captain._id,
            status: 'ongoing'
        }).populate('user').populate('captain');

        if (!ride) {
            return res.status(404).json({ message: 'No active ride' });
        }

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}




