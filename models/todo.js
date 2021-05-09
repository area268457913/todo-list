const mongoose = require('mongoose')// 載入 mongoose
const Schema = mongoose.Schema
const todoSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    require: true // 這是必填欄位，不能空白
  },
  isDone: {// is暗示型別為布林值
    type: Boolean,
    default: false //預設完成狀態為false，代表每筆 todo 紀錄產生時，都會設定初始狀態為「還沒被完成
  }
})
module.exports = mongoose.model('Todo', todoSchema)// 透過 module.exports 把這個 schema 輸出，匯出的時候我們把這份 schema 命名為 Todo，以後在其他的檔案直接使用 Todo 就可以操作和「待辦事項」有關的資料