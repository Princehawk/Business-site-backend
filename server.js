import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import db from './config/db.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

//routes
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.send('Backend is running')
})

// Test DB route
app.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      console.error('Database error:', err)
      res.status(500).send('Database connection error')
    } else {
      res.send(`✅ Database connected. Test result: ${results[0].result}`)
    }
  })
})

const port = process.env.port
app.listen(port, () => console.log('server is running'))
