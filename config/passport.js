const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy //多傳入一個 Strategy 物件，這是在官網說明裡找到的指定寫法：
const User = require('../models/user')
const bcrypt = require('bcryptjs')
// 引用 Facebook 登入策略
const FacebookStrategy = require('passport-facebook').Strategy

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

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
    //profileFields，這個設定是和 Facebook 要求開放的資料，我們要了兩種資料
    //email：這是必要的，需要拿回來當成帳號
    //displayName：Facebook 上的公開名稱，也許能和 User 的 name 屬性對應起來
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        // Math.random() - 先用產生一個 0-1 的隨機小數
        // .toString(36) - 運用進位轉換將 0.3767988078359976 變成英數參雜的亂碼。這裡選用 36 進位，是因為 36 是 10 個數字 (0, 1, 2, ... 9) 加上 26 個英文字母 (a, b, c, ... , x, y, z) 的總數，在 36 進位裡剛好可以取得所有的英數字母。此時的回傳結果可能是'0.dkbxb14fqq4'
        // 
        // slice(-8) - 最後，截切字串的最後一段，得到八個字母，例如 'xb14fqq4'
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
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