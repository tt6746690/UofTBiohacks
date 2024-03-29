'use strict'
// Require modules
const Router = require('koa-router');
const jwt = require('koa-jwt');
// Require internally
const userMiddlewares = require('./userMiddlewares');
const util = require('../util');                      // for error function
const config = require('../config');                  // temporary KEY
const User = require('../models/user');               // User is User Model

 // Initiate router instance
let router = new Router();

router.get('/', userMiddlewares.getAllUsers)
//router.get('/excel', userMiddlewares.excel)

router.use('/register', userMiddlewares.validateRegistration);
router.post('/register', userMiddlewares.saveUsertoDatabase);

router.get('/auth', function*(){})

router.post('/login', userMiddlewares.requestLogin);
router.get('/logout', function*(){
    this.body = {
        message: "logged out"
    };
});

router.use('/all', userMiddlewares.validateAdmin)
router.use('/all', userMiddlewares.getUsers)
router.get('/all', function* (){          // returns json array without encrypted passwords
    this.body = this.users;
}),
router.use('/all/csv', userMiddlewares.validateAdmin)
router.get('/all/csv', userMiddlewares.getCSV)



module.exports = router;
