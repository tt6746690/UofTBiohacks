'use strict'


// Require Local
const Group = require('../models/group');             // Group is a group Model

// Middleware: query database to ensure nonmatching group name is provided
module.exports.validateGroupName = function* (next){
  let group = yield Group.findOne({
    name: this.request.body.name
  })
  if (group) {
    this.body = {
      message: "Group name already exists"
    }
  } else if (!this.request.body.name) {
    this.body = {
      message: "No group name given"
    }
  } else {
    yield next
  }
}

// POST: Create a new group given JSON {name: String} and save group into database
module.exports.saveGrouptoDatabase = function* (){
  let group = new Group({
    name: this.request.body.name           // JSON in post is stored in request.body
  })
  try {
    var groupModel = yield group.save()    // use try/catch + yield instead of if(error)/else in callbacks
    this.body = groupModel
  } catch (err) {
    this.response.status = 500
    console.error(err)
    util.errorResponse(this)
  }
}

// Middleware: query database by group id and attach to this.groupModel
module.exports.findGroupbyId = function* (id, next) {         //middleware for attaching matching group document to this.groupModel
    try {
      let groupModel = yield Group.findById(id);
      if (!groupModel) {
        this.status = 404                              // this is a koa context that encapsulates req and res
        util.errorResponse(this)
      } else {
        this.groupModel = groupModel
        yield next
      }
    } catch (err) {
      console.error(err)
      this.status = 500
      util.errorResponse(this)
    }
  }

//POST: invite - route to invite a user, accepts username for post
module.exports.inviteUsertoGroup = function* (){
    this.body = 'success'
}
