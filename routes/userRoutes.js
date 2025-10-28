import express from 'express'
import {
  addUser,
  getUsers,
  updateUser,
  deleteUser,
  patchUser
} from '../controllers/userController.js'

const router = express.Router()

router.use('/post', addUser)
router.use('/get', getUsers)
router.use('/update/:id', updateUser)
router.use('/delete/:id', deleteUser)
router.use('/patch/:id', patchUser)

export default router
