const axios = require('axios');
const captainModel = require('../models/captain.model');


// 📍 1️⃣ Address → Coordinates
module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.MAPBOX_TOKEN;

    if (!address) {
        throw new Error('Address is required');
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?country=IN&limit=1&access_token=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.features.length > 0) {
        const [lng, lat] = response.data.features[0].center;
        return { lat, lng };
    } else {
        throw new Error('Unable to fetch coordinates');
    }
};



// 🔎 2️⃣ Autocomplete Suggestions (Mapbox)
module.exports.getAutoCompleteSuggestions = async (input) => {
    const apiKey = process.env.MAPBOX_TOKEN;

    if (!input) {
        throw new Error('Query is required');
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?autocomplete=true&country=IN&bbox=74.0,21.0,82.8,26.9&limit=10&types=place,locality,address&access_token=${apiKey}`;

    const response = await axios.get(url);

    return response.data.features.map(place => place.place_name);
};



// 🚗 3️⃣ Captains in Radius (No Change Needed)
module.exports.getCaptainsInTheRadius = async (lat, lng, radius) => {
    return await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius / 6371]
            }
        },
        status: 'available'
    });
};

module.exports.getNearestAvailableCaptains = async (lat, lng, maxDistanceMeters = 10000, limit = 20) => {
    return await captainModel.find({
        status: 'available',
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                },
                $maxDistance: maxDistanceMeters
            }
        }
    }).limit(limit);
};
    
module.exports.getDistanceTime = async (origin, destination) => {
    const apiKey = process.env.MAPBOX_TOKEN;

    if (!origin || !destination) {
        throw new Error("Origin and destination required");
    }

    

    // Geocoding
    const originGeo = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(origin)}.json?country=IN&limit=1&access_token=${apiKey}`
    );

    const destGeo = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destination)}.json?country=IN&limit=1&access_token=${apiKey}`
    );

    const originCoords = originGeo.data.features[0].center;
    const destCoords = destGeo.data.features[0].center;

    // Directions
    const directions = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords[0]},${originCoords[1]};${destCoords[0]},${destCoords[1]}?access_token=${apiKey}`
    );

    const route = directions.data.routes[0];

    // Formatting
    const distanceInKm = (route.distance / 1000).toFixed(1);
    const totalSeconds = route.duration;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return {
        distance: {
            text: `${distanceInKm} km`,
            value: Math.round(route.distance)
        },
        duration: {
            text: `${hours} hours ${minutes} mins`,
            value: Math.round(totalSeconds)
        },
        status: "OK"
        
    };
    
};

module.exports.getDistanceTimeFromCoordinates = async (originCoords, destinationCoords) => {
    const apiKey = process.env.MAPBOX_TOKEN;

    if (originCoords?.lng == null || originCoords?.lat == null || destinationCoords?.lng == null || destinationCoords?.lat == null) {
        throw new Error("Origin and destination coordinates required");
    }

    const directions = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords.lng},${originCoords.lat};${destinationCoords.lng},${destinationCoords.lat}?access_token=${apiKey}`
    );

    const route = directions.data.routes[0];
    const distanceInKm = (route.distance / 1000).toFixed(1);
    const totalSeconds = route.duration;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return {
        distance: {
            text: `${distanceInKm} km`,
            value: Math.round(route.distance)
        },
        duration: {
            text: `${hours} hours ${minutes} mins`,
            value: Math.round(totalSeconds)
        },
        status: "OK"
    };
};
