const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore  = require('connect-mongo')
const methodOverride = require('method-override')
const logger = require('morgan')
const flash = require('express-flash')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const postRoutes = require('./routes/posts')

//Use .env file in config folder
require('dotenv').config({ path: './config/.env' })

//Passport config
require("./config/passport")(passport)

// connect to database
connectDB()

//Use EJS for views
app.set('view engine', 'ejs')

//Body parsing
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

//logger
app.use(logger('dev'))

//Static folder
app.use(express.static('public'))

//Use forms for put / delete
app.use(methodOverride('_method'))

//Setup session stored in MongoDB
app.use(
    session({
     secret: 'keyboard cat',
     resave: false,
     saveUninitialized: false,
     store: MongoStore.create({ client: mongoose.connection.getClient() }),
    })
)

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Use flash to display erros, info
app.use(flash())

// Setup routes the server listens to
app.use('/', mainRoutes)
app.use('/post', postRoutes)

//Server running
app.listen(process.env.PORT, () => {
    console.log(`Server is running, betta go catch it!`)
})