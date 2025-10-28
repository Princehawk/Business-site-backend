import db from '../config/db.js'

//add user
export const addUser = (req, res) => {
  const {
    first_name,
    last_name,
    company_name,
    role,
    email,
    phone_number,
    description
  } = req.body

  if (
    !first_name ||
    !last_name ||
    !email ||
    !company_name ||
    !phone_number ||
    !role
  ) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  //step 1 : check if email already exists
  const checkEmail = `SELECT * FROM users WHERE email = ?`
  db.query(checkEmail, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (results.length > 0) {
      //Email already exists
      console.log('Email already exists. skipping insert')
      return res.status(400).json({
        message: 'Email already exists'
      })
    } else {
      // step 2 : insert only if email not found
      const sql = `INSERT INTO users (first_name, last_name, company_name, role, email , phone_number, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)`

      db.query(
        sql,
        [
          first_name,
          last_name,
          company_name,
          role,
          email,
          phone_number,
          description
        ],
        (err, result) => {
          if (err) {
            if (err && err.code === 'ER_DUP_ENTRY') {
              return res.status(400).json({ message: 'Email already exists' })
            }
            console.error('error inserting details:', err)
            return res.status(400).json({ error: 'Database insert failed' })
          } else {
            console.log('Details were inserted', result)
            return res.status(200).json({
              message: 'Details added successfully',
              user: {
                first_name,
                last_name,
                company_name,
                role,
                email,
                phone_number,
                description
              }
            })
          }
        }
      )
    }
  })
}

// get all users
export const getUsers = (req, res) => {
  db.query(`SELECT * FROM users`, (err, results) => {
    if (err) {
      console.error('error getting users', err)
      return res.status(400).json({ error: 'Database error' })
    } else {
      console.log('Users were retrieved from the database', results)
      return res.status(200).json({
        message: 'Users retrieved successfully',
        results
      })
    }
  })
}

//update user

export const updateUser = (req, res) => {
  const { id } = req.params
  const { first_name, last_name, company_name, email } = req.body

  const sql = ` UPDATE users SET first_name = ? , last_name = ? , company_name = ? , email = ? WHERE id = ? `

  db.query(
    sql,
    [first_name, last_name, company_name, email, id],
    (err, result) => {
      if (err) {
        console.error('error updating user:', err)
        return res.status(400).json({ error: err.message })
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' })
      } else {
        console.log('User updated successfully')
        return res.status(200).json({ message: 'User was updated', result })
      }
    }
  )
}

//delete user

export const deleteUser = (req, res) => {
  const { id } = req.params

  const sql = `DELETE FROM users WHERE id = ?`
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('error deleting user')
      return res.status(400).json({
        error: err.message
      })
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' })
    } else {
      console.log('User was deleted')
      return res.status(200).json({
        message: results
      })
    }
  })
}

//patch user

export const patchUser = (req, res) => {
  const { id } = req.params
  const updates = req.body

  // Check if there's anything to update
  if (!Object.keys(updates).length) {
    return res.status(400).json({ message: 'No fields provided for update.' })
  }

  // Dynamically build query parts based on provided fields
  const fields = Object.keys(updates)
    .map(key => `${key} = ?`)
    .join(', ')
  const values = Object.values(updates)

  const query = `UPDATE users SET ${fields} WHERE id = ?`

  db.query(query, [...values, id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already exists!' })
      }
      return res.status(500).json({ error: err.message })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ message: 'User updated successfully!' })
  })
}
