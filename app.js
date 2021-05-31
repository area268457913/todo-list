const express = require('express')
const exphbs = require('express-handlebars')
// 載入 method-override
const methodOverride = require('method-override')
// 引用 body-parser
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()

const PORT = process.env.PORT

// 引用路由器
const routes = require('./routes')
//  載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')

require('./config/mongoose')

// 設定連線到 mongoDB
// mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })

// // 取得資料庫連線狀態
// const db = mongoose.connection
// // 連線異常
// db.on('error', () => {
//   console.log('mongodb error!')
// })
// // 連線成功
// db.once('open', () => {
//   console.log('mongodb connected!')
// })

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SESSION_SECRET, // secret 是 session 用來驗證 session id 的字串， 現在我們設定為 'ThisIsMySecret'，但你可以隨機輸入一個字串。
  resave: false, // 當設定為 true 時 ， 會在每一次與使用者互動後，強制把 session 更新到 session store 裡
  saveUninitialized: true // 強制將未初始化的 session 存回 session store 。 例如未登入的使用者的 session。
}))

// 呼叫 Passport 函式並傳入 app ， 要寫在路由之前
usePassport(app)

app.use(flash())
// 使用 app.use 代表這組 middleware 會作用於所有的路由
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  // res.locals 是 Express.js 幫我們開的一條捷徑，放在 res.locals 裡的資料，所有的 view 都可以存取
  // res.locals.isAuthenticated : 把 req.isAuthenticated() 回傳的布林值，交給 res 使用
  res.locals.user = req.user
  //  res.locals.user : 把使用者資料交給 res 使用
  res.locals.success_msg = req.flash('success_msg')
  //  設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')
  //  設定 warning_msg 訊息
  next()
})
// 將 request 導入路由器
app.use(routes)

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// app.get('/', (req, res) => {
//   Todo.find()//取todo model 裡的所有資料
//     .lean()//把 mongoose 的 model 物件轉成乾淨的javascript 資料陣列
//     .sort({ _id: 'asc' })// 新增這裡：根據 _id 升冪排序
//     //sort() 是 Mongoose 提供的排序方法，裡面的參數 { _id: 'asc' } 代表「根據 _id 用升冪 (ascending) 排序」，反之，如果要降冪 (desscending) 排序，可以寫 'desc'。
//     .then(todos => res.render('index', { todos }))//將資料傳給index 樣板
//     .catch(error => console.error(error))//錯誤處理

// })

// app.get('/todos/new', (req, res) => {
//   return res.render('new')
// })

// app.post('/todos', (req, res) => {
//   const name = req.body.name // 從 req.body拿出表單裡的 name 資料
//   return Todo.create({ name })//存入資料庫
//     .then(() => res.redirect('/'))// 新增完成後導回首頁
//     .catch(error => console.log(error))
// })

// app.get('/todos/:id', (req, res) => {
//   const id = req.params.id
//   return Todo.findById(id)// findById 以ＩＤ 去尋找
//     .lean()
//     .then((todo) => res.render('detail', { todo }))
//     .catch(error => console.log(error))
// })

// app.get('/todos/:id/edit', (req, res) => {
//   const id = req.params.id
//   return Todo.findById(id)
//     .lean()
//     .then((todo) => res.render('edit', { todo }))
//     .catch(error => console.log(error))
// })

// app.put('/todos/:id/', (req, res) => {
//   const id = req.params.id
//   const { name, isDone } = req.body
//   return Todo.findById(id)
//     .then(todo => {
//       todo.name = name
//       todo.isDone = isDone === 'on'
//       return todo.save()
//     })
//     .then(() => res.redirect(`/todos/${id}`))
//     .catch(error => console.log(error))
// })

// app.delete('/todos/:id', (req, res) => {
//   const id = req.params.id
//   return Todo.findById(id)
//     .then(todo => todo.remove())
//     .then(() => res.redirect('/'))
//     .catch(error => console.log(error))
// })

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})