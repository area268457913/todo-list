const express = require('express')
const mongoose = require('mongoose')// 載入 mongoose
const exphbs = require('express-handlebars')
const app = express()
const port = 3000

mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })// 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})