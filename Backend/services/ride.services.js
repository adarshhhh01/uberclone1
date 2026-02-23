const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const crypto = require('crypto');

function calculateFareByVehicle(distanceTime) {
    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };

    return {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };
}

async function getFare(pickup, destination) {

    
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    

    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    const fare = calculateFareByVehicle(distanceTime);
    
    return fare;


}

module.exports.getFare = getFare;

function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}



module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);
    const fare = calculateFareByVehicle(distanceTime);



    let pickupCoordinates
    let destinationCoordinates

    try {
        pickupCoordinates = await mapService.getAddressCoordinate(pickup)
        destinationCoordinates = await mapService.getAddressCoordinate(destination)
    } catch (error) {
        // Keep ride creation resilient even if geocoding fails.
    }

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        pickupCoordinates,
        destinationCoordinates,
        vehicleType,
        otp: getOtp(6),
        fare: fare[ vehicleType ],
        distance: distanceTime.distance.value,
        duration: distanceTime.duration.value
    })

    return ride;
}

module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}

module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp.trim()) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}

module.exports.cancelRide = async ({ rideId, captain, reason }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted' && ride.status !== 'ongoing') {
        throw new Error('Ride cannot be cancelled now');
    }

    let coveredDistanceMeters = 0;
    let cancellationCharge = 0;

    if (ride.status === 'ongoing' && ride.pickupCoordinates?.lat != null && ride.pickupCoordinates?.lng != null) {
        const captainCoords = ride.captain?.location?.coordinates || captain.location?.coordinates;

        if (captainCoords?.length === 2) {
            try {
                const distanceInfo = await mapService.getDistanceTimeFromCoordinates(
                    { lng: ride.pickupCoordinates.lng, lat: ride.pickupCoordinates.lat },
                    { lng: captainCoords[0], lat: captainCoords[1] }
                );
                coveredDistanceMeters = distanceInfo.distance.value;
            } catch (error) {
                coveredDistanceMeters = 0;
            }
        }
    }

    if (ride.distance > 0 && coveredDistanceMeters > 0) {
        const coveredRatio = Math.min(coveredDistanceMeters / ride.distance, 1);
        cancellationCharge = Number((ride.fare * coveredRatio).toFixed(2));
    }

    await rideModel.findByIdAndUpdate(rideId, {
        status: 'cancelled',
        coveredDistanceMeters,
        cancellationCharge,
        cancelledBy: 'captain',
        cancellationReason: reason || 'Ride cancelled by captain'
    });

    const updatedRide = await rideModel.findById(rideId).populate('user').populate('captain');
    return updatedRide;
}
