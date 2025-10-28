import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
})

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err.message)
  } else {
    console.log('✅ Connected to MySQL Database (business_site)')
  }
})

export default db
