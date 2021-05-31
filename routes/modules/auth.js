const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
  // GET /auth/facebook 是向 Facebook 發出請求，帶入的參數 scope: ['email', 'public_profile'] 是我們向 Facebook 要求的資料
}))
// GET /auth/facebook/callback 是 Facebook 把資料發回來的地方
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

module.exports = router