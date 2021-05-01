const mongoose = require('mongoose')// 載入 mongoose
const Schema = mongoose.Schema
const todoSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    require: true // 這是必填欄位，不能空白
  }
})
module.exports = mongoose.model('Todo', todoSchema)// 透過 module.exports 把這個 schema 輸出，匯出的時候我們把這份 schema 命名為 Todo，以後在其他的檔案直接使用 Todo 就可以操作和「待辦事項」有關的資料