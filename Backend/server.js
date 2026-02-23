const http = require('http')
const app = require('./app')
// const { Server } = require("socket.io");
const port = process.env.PORT||3000
const { initializeSocket } = require('./socket')
const connectDB = require('./db/db')


const server = http.createServer(app)

initializeSocket(server)

async function startServer() {
    try {
        await connectDB()
        server.listen(port, ()=>{
            console.log(`Server is running on port ${port}`)
        })
    } catch (error) {
        console.error(`Server startup failed: ${error.message}`)
        process.exit(1)
    }
}

startServer()
