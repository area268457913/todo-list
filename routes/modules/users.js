const express = require('express')
const router = express.Router()
const User = require('../../models/user')
// 引用 passport
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})
// 加入 middleware ， 驗證 request 登入狀態
router.post('/login', passport.authenticate('local', {
  successRedirect: '/', // 登入成功
  failureRedirect: '/users/login' // 登入失敗
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  // 取得註冊表單參數
  const { name, email, password, confirmPassword } = req.body
  // 檢查使用者是否已經註冊
  User.findOne({ email }).then(user => {
    // 如果已註冊，退回原本畫面
    if (user) {
      console.log('User already exists.')
      res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    } else {
      // 如果還沒註冊： 寫入資料庫
      return User.create({
        name,
        email,
        password
      })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    }
  })
})

router.get('/logout', (req, res) => {
  req.logout() // 是 Passport.js 提供的函式，會清除 session 。
  res.redirect('/users/login')
})
module.exports = router