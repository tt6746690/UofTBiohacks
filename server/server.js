'use strict'

const koa = require('koa')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const util = require('./util');
let app = koa()
app.use(require('koa-validate')());

//more koa middleware https://github.com/koajs/koa/wiki#middleware

app.keys = ['h4ckerbio']
/*
mongoose.connect('mongodb://biohacks:hacker@ds037095.mongolab.com:37095/biohacks', {
  user: 'biohacks',
  pass: 'hacker'
})
*/
mongoose.connect('mongodb://127.0.0.1/test')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected!')
});

// Global middleware
app.use(bodyParser())  //parsing POST form data and populate req.body

// Reset 15 minutes at each request: set cookie maximum age
app.use(session({maxAge: 900000}, app))

app.use(function* (next) {
  this.type = 'json'
  yield next
})

// logger
app.use(function* (next) {
  var start = new Date
  yield next
  var ms = new Date - start
  this.set('X-Response-Time', ms + 'ms')
  console.log('%s %s - %s', this.method, this.url, ms)
})

//routes
require('./routes/user')(app)
require('./routes/group')(app)

app.listen(3000)