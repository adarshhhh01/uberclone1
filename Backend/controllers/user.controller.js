const userModel = require('../models/user.model')
const userService = require('../services/user.services')
const { validationResult } = require('express-validator')
const blackListTokenModel = require('../models/blackListTokenModel')
module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const isUserExist = await userModel.findOne({ email: req.body.email })
  if (isUserExist) {
    return res.status(400).json({ message: 'User with this email already exists' })
  }

  try {
    const { fullName, email, password } = req.body
    const hashpassword = await userModel.hashPassword(password)
    const user = await userService.createUser({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email,
      password: hashpassword
    })
    const token = user.generateAuthToken()
    res.status(201).json({ token, user })
  } catch (error) {
    next(error)
  }
}

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    const token = user.generateAuthToken()

    res.cookie('token', token, {
      httpOnly: true /*Frontend JavaScript (like document.cookie) isko access nahi kar sakti.*/ /*Agar koi XSS attack kare toh token chura nahi paayega. */,
      secure: process.env.NODE_ENV === 'development'
    })

    res.status(200).json({ token, user })
  } catch (error) {
    next(error)
  }
}

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json({ user: req.user })
}


module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie('token');
  const token = req.cookies.token || req.headers.authorization.split(' ')[1];
  await blackListTokenModel.create({ token });

  res.status(200).json({ message: 'Logged out successfully' });
}