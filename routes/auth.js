const express = require('express')
const authController = require('../Controllers/authControllers')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express()

router.post('/register',authController.register)
router.post('/login',authController.login)
router.get('/profile', authMiddleware.auth,authController.getProfile);
router.get('/logout', authMiddleware.auth,authController.logout);
module.exports = router