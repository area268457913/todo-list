const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy //多傳入一個 Strategy 物件，這是在官網說明裡找到的指定寫法：
const User = require('../models/user')
const bcrypt = require('bcryptjs')
module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略

  passport.use(new LocalStrategy({
    // { usernameField: 'email'} ，把驗證項目從預設的 username 改成 email
    usernameField: 'email'
  }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' })
        }
        // bcrypt.compare(password, user.password) 的第一個參數是使用者的輸入值，而第二個參數是資料庫裡的雜湊值，bcrypt 會幫我們做比對，並回傳布林值，在文中我們用 isMatch 來代表。
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: 'Email or Password incorrect.' })
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))

  // 設定序列化與反序列化

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}