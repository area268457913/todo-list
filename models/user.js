const mongoose = require('mongoose')// 載入 mongoose
const Schema = mongoose.Schema
const userSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    required: true // 這是必填欄位，不能空白
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createAt: { // 使用者註冊時間
    type: Date,
    default: Date.now // default設定預設值， date.now使用者的當下時間
  }


})
module.exports = mongoose.model('User', userSchema)// 透過 module.exports 把這個 schema 輸出，匯出的時候我們把這份 schema 命名為 User，以後在其他的檔案直接使用 User 就可以操作和「待辦事項」有關的資料