const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home')
const authController = require('../controllers/auth')
const postsController = require('../controllers/posts')
const { ensureAuth, ensureGuest } = require("../middleware/auth")

router.get('/', homeController.getIndex)
router.get('/login', authController.getLogin)
router.get('/signup', authController.getSignup)
router.post('/signup', authController.postSignup)
router.get('/profile', ensureAuth,  postsController.getProfile)

module.exports = router