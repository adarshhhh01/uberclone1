const socketIo = require('socket.io')
const userModel = require('./models/user.model')
const captainModel = require('./models/captain.model')
const rideModel = require('./models/ride.model')
const {
  getOnlineTransitionUpdate,
  getOfflineTransitionUpdate
} = require('./services/captainMetrics.service')

let io

function initializeSocket (server) {
  io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', socket => {
    // console.log(`Client connected: ${socket.id}`);

    socket.on('join', async data => {
      const { userId, userType } = data

      try {
        if (userType === 'user') {
          socket.data.userType = 'user'
          socket.data.userId = userId
          await userModel.findByIdAndUpdate(userId, { socketId: socket.id })
          // console.log(`Updated socketId for user ${userId}`);
        } else if (userType === 'captain') {
          socket.data.userType = 'captain'
          socket.data.userId = userId
          const captain = await captainModel.findById(userId)
          const updateDoc = getOnlineTransitionUpdate(captain)
          updateDoc.socketId = socket.id
          await captainModel.findByIdAndUpdate(userId, updateDoc)
          // console.log(`Updated socketId for captain ${userId}`);
        }
      } catch (error) {
        console.error(
          `Error updating socketId for ${userType} ${userId}:`,
          error
        )
      }
    })

    socket.on('update-location-captain', async data => {
      const { location } = data
      const captainId = socket.data?.userType === 'captain' ? socket.data.userId : null

      if (!captainId) {
        return socket.emit('error', { message: 'Unauthorized captain socket' })
      }

      if (!location || location.lat == null || location.lng == null) {
        return socket.emit('error', { message: 'Invalid location data' })
      }

      const captain = await captainModel.findById(captainId)
      const updateDoc = getOnlineTransitionUpdate(captain)
      await captainModel.findByIdAndUpdate(captainId, {
        ...updateDoc,
        location: {
          type: 'Point',
          coordinates: [location.lng, location.lat]
        }
      })

      const ongoingRide = await rideModel
        .findOne({ captain: captainId, status: 'ongoing' })
        .populate('user')

      if (ongoingRide?.user?.socketId) {
        io.to(ongoingRide.user.socketId).emit('captain-location-updated', {
          rideId: ongoingRide._id.toString(),
          location: {
            lat: location.lat,
            lng: location.lng
          }
        })
      }
    })

    socket.on('disconnect', async () => {
      try {
        const captain = await captainModel.findOne({ socketId: socket.id })
        if (captain) {
          const updateDoc = getOfflineTransitionUpdate(captain, { socketId: null })
          await captainModel.findByIdAndUpdate(captain._id, updateDoc)
        }
      } catch (error) {
        console.error('Error updating captain on disconnect:', error)
      }
      // console.log(`Client disconnected: ${socket.id}`);
    })
  })
}

const sendMessageToSocketId = (socketId, messageObject) => {
  if (io && socketId) {
    io.to(socketId).emit(messageObject.event, messageObject.data)
  }
}

module.exports = { initializeSocket, sendMessageToSocketId }
