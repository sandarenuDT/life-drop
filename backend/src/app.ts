import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { authRouter } from './modules/auth/auth.router'
import { errorMiddleware } from './middleware/error.middleware'
import { centersRouter } from './modules/centers/centers.router'
import { donationsRouter } from './modules/donations/donations.router'
import { emergencyRouter } from './modules/emergency/emergency.router'
import { usersRouter } from './modules/users/users.router'

dotenv.config()

export const app = express()
export const httpServer = createServer(app)
export const io = new Server(httpServer, {
  cors: { origin: '*' }
})

// Runs on every request
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Test this in browser: http://localhost:4000/health
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'LifeDrop API is running!'
  })
})
// Routes
app.use('/api/auth', authRouter)
app.use('/api/centers', centersRouter)
app.use('/api/donations', donationsRouter)
app.use('/api/emergency', emergencyRouter)
app.use('/api/users', usersRouter)
// Global error handler
app.use(errorMiddleware)

// Start the server
const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log('')
  console.log('  🩸 LifeDrop server started!')
  console.log(`  🌐 http://localhost:${PORT}/health`)
  console.log('')
})