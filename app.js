const express = require('express')
const mongoose = require('mongoose')// 載入 mongoose
const exphbs = require('express-handlebars')
const Todo = require('./models/todo')//載入todo model
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
  Todo.find()//取todo model 裡的所有資料
    .lean()//把 mongoose 的 model 物件轉成乾淨的javascript 資料陣列
    .then(todos => res.render('index', { todos }))//將資料傳給index 樣板
    .catch(error => console.error(error))//錯誤處理

})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})