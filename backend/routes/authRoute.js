import express from 'express'
import { signUp , login , logOut, getMe} from '../controllers/authController.js'
import protectRoute from '../middleware/protectRoute.js'

const router = express.Router()

router.post('/signup',signUp)
router.post('/login',login)
router.post('/logout',logOut)
router.get('/me',protectRoute,getMe)

export default router