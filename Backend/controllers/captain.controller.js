const captainModel = require('../models/captain.model')
const captainService = require('../services/captain.services')
const { validationResult } = require('express-validator')
const blackListTokenModel = require('../models/blackListTokenModel')
const rideModel = require('../models/ride.model')
const {
    getOnlineTransitionUpdate,
    getOfflineTransitionUpdate,
    getEffectiveOnlineSeconds
} = require('../services/captainMetrics.service')


module.exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const isCaptainExist = await captainModel.findOne({ email: req.body.email })
    if (isCaptainExist) {
        return res.status(400).json({ message: 'Captain with this email already exists' })
    }
    

    try {
        const {fullName, email, password, vehicleDetails} = req.body
        const hashpassword = await captainModel.hashPassword(password)
        const captain = await captainService.createCaptain({
            firstName: fullName.firstName,
            lastName: fullName.lastName || '',
            email,
            password: hashpassword,
            color: vehicleDetails.color,
            plate: vehicleDetails.plate,
            vehicleType: vehicleDetails.vehicleType,
            capacity: vehicleDetails.capacity    
        })
        const token = captain.generateAuthToken()
        res.status(201).json({ token, captain })
    } catch (error) {
        next(error)
    }
}


module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const { email, password } = req.body
        const captain = await captainModel.findOne({ email }).select('+password')
        if (!captain) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }
        const isMatch = await captain.comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }
        const token = captain.generateAuthToken()
        res.cookie('token', token)

        res.status(200).json({ token, captain });
    } catch (error) {
        next(error)
    }
}


module.exports.getCaptainProfile = async (req, res, next) => {
        res.status(200).json({captain:  req.captain })
    
}



module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.split('Bearer ')[1]
    await blackListTokenModel.create({ token })
    try {
        const updateDoc = getOfflineTransitionUpdate(req.captain, { socketId: null })
        await captainModel.findByIdAndUpdate(req.captain._id, updateDoc)
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error)
    }
}

module.exports.updateCaptainLocation = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { lat, lng } = req.body

    try {
        const availabilityUpdate = getOnlineTransitionUpdate(req.captain)
        const captain = await captainModel.findByIdAndUpdate(
            req.captain._id,
            {
                ...availabilityUpdate,
                location: {
                    type: 'Point',
                    coordinates: [lng, lat]
                }
            },
            { new: true }
        )

        return res.status(200).json({
            message: 'Captain location updated',
            captain
        })
    } catch (error) {
        next(error)
    }
}

module.exports.updateCaptainStatus = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { status } = req.body

    try {
        const updateDoc =
            status === 'available'
                ? getOnlineTransitionUpdate(req.captain)
                : getOfflineTransitionUpdate(req.captain, { socketId: null })

        const captain = await captainModel.findByIdAndUpdate(
            req.captain._id,
            updateDoc,
            { new: true }
        )

        return res.status(200).json({
            message: 'Captain status updated',
            captain
        })
    } catch (error) {
        next(error)
    }
}

module.exports.getCaptainStats = async (req, res, next) => {
    try {
        const rideStats = await rideModel.aggregate([
            {
                $match: {
                    captain: req.captain._id,
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: null,
                    totalRides: { $sum: 1 },
                    totalDistanceMeters: { $sum: { $ifNull: ['$distance', 0] } }
                }
            }
        ])

        const totalRides = rideStats[0]?.totalRides || 0
        const totalDistanceMeters = rideStats[0]?.totalDistanceMeters || 0
        const totalDistanceKm = Number((totalDistanceMeters / 1000).toFixed(2))
        const onlineSeconds = getEffectiveOnlineSeconds(req.captain)
        const hoursOnline = Number((onlineSeconds / 3600).toFixed(2))

        return res.status(200).json({
            hoursOnline,
            totalRides,
            totalDistanceKm
        })
    } catch (error) {
        return next(error)
    }
}
