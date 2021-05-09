// const mongoose = require('mongoose')
const Todo = require('../todo') // 載入 todo model
require('../../config/mongoose')
// mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })
// const db = mongoose.connection
// db.on('error', () => {
//   console.log('mongodb error!')
// })
db.once('open', () => {
  //   console.log('mongodb connected!')
  for (let i = 0; i < 10; i++) {
    Todo.create({ name: `name-${i}` })//Todo.create() 產生一筆資料
  }
  console.log('done')
})