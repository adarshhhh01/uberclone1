const captainController = require('../controllers/captain.controller');
const express = require('express')
const router = express.Router();
const {body} = require('express-validator');
const authmiddleware = require('../middleware/auth.middleware')

router.post('/register', [
    body('fullName.firstName').isLength({min: 3}).withMessage('First name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please use a valid email address.'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('vehicleDetails.color').notEmpty().withMessage('Vehicle color is required'),
    body('vehicleDetails.plate').notEmpty().withMessage('Vehicle plate is required'),
    body('vehicleDetails.vehicleType').isIn(['car', 'moto', 'auto']).withMessage('Vehicle type must be car, moto, or auto'),
    body('vehicleDetails.capacity').isInt({min: 1, max: 7}).withMessage('Capacity must be between 1 and 7')
], captainController.registerCaptain);

router.post('/login', [
    body('email').isEmail().withMessage('Please use a valid email address.'),
    body('password').notEmpty().withMessage('Password is required')
], captainController.loginCaptain);


router.get('/profile', authmiddleware.authCaptain, captainController.getCaptainProfile)

router.get('/stats', authmiddleware.authCaptain, captainController.getCaptainStats)



router.post('/logout', authmiddleware.authCaptain, captainController.logoutCaptain)

router.patch('/location',
    authmiddleware.authCaptain,
    [
        body('lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
        body('lng').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180')
    ],
    captainController.updateCaptainLocation
)

router.patch('/status',
    authmiddleware.authCaptain,
    [
        body('status')
            .isIn(['available', 'unavailable'])
            .withMessage('Status must be available or unavailable')
    ],
    captainController.updateCaptainStatus
)

module.exports = router;
