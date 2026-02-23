const express = require('express');
const router = express.Router();
// here before the controller, we can add middlewares for authentication, validation, etc.
//called to be as expressValidator 

const {body} = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware')



router.post('/register', [ 
    body('fullName.firstName').isLength({min: 3}).withMessage('First name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please use a valid email address.'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long')
]
,userController.registerUser);

router.post('/login', [
    body('email').isEmail().withMessage('Please use a valid email address.'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long')
], userController.loginUser);

router.get('/profile',authMiddleware.authUser, userController.getUserProfile)


router.get('/logout',authMiddleware.authUser, (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
