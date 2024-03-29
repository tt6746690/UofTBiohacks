// Libraries
import React, { Component } from 'react'
import { connect } from 'react-redux'

// Components
import FMUI, { FormsyText } from 'formsy-material-ui'
import RaisedButton from 'material-ui/lib/raised-button'

import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn} from 'material-ui/lib/table';


import Layout from '../components/Layout'

// Actions
import { createGroup, acceptGroupInvite, leaveGroup } from '../actions/logged'

// Utilites
import { ajaxPost, ajaxGet } from '../util'

export default class Group extends Component {
  constructor(){
    super()
    this.state = { canSubmit: false }
  }
  enableButton = () => {
    this.setState({ canSubmit: true })
  };

  disableButton = () => {
    this.setState({ canSubmit: false })
  };


  submitForm = (model) => {
    const { dispatch } = this.props
    let uri;
    if(this.props.groupModel){
      model = {
        emailOrUsername: model.name
      }
      uri = '/group/'+ this.props.groupModel._id + '/invite'
    }else{
      uri = '/group/create'
    }
    ajaxPost(model, uri, this.props.jwt, (err, data) => {
      if (err) {
        console.error(err)
      } else {
        dispatch(createGroup(data))
      }
    })
  };

  acceptInviteHandler = (modelid) => {
    const { dispatch } = this.props
    ajaxGet('/group/' + modelid + '/accept', this.props.jwt, (err, data) => {
      if (err) {
        console.error(err)
      } else {
        dispatch(acceptGroupInvite(data))
      }
    })

  };
  leaveGroupHandler = () => {
    const {dispatch} = this.props
    ajaxGet('/group/' + this.props.groupModel._id + '/leave', this.props.jwt, (err, data) => {
      if (err) {
        console.error(err)
      } else {
        console.log(data)
        dispatch(leaveGroup(data))
      }
    })


  };
  onRowSelection = (e) => {
    console.log(e)
  };

  createGroupView = () => {
    const {groupModel, userModel} = this.props
    let content = null
    if(!groupModel){
      content =
      <div className="createGroup">
        <h2>Create a Group</h2>
        <Formsy.Form
          onValid = {this.enableButton}
          onInvalid = {this.disableButton}
          onValidSubmit = {this.submitForm}>

          <FormsyText style={{display: 'block'}}
            name = 'name'
            required hintText = "What is your group name?"
            floatingLabelText = "Group Name"
          />

          <RaisedButton
            type = "submit"
            label = "Submit"
            disabled = {!this.state.canSubmit}
          />
        </Formsy.Form>
      </div>
    }
    return content
  };

  inviteView = () => {
    const {groupModel, userModel} = this.props
    let content
      if(!groupModel && userModel.invites.length > 0){
        content = userModel.invites.map((model, i) =>
            <div key={i}>{model.name}
              <RaisedButton
                type = "Submit"
                label = "Accept"
                onTouchTap = {() => {
                  this.acceptInviteHandler(model._id)
                }}
              />
            </div>
        )

      } else if(!groupModel && userModel.invites.length === 0){
        content =  <p>You currently have no invites! </p>
      } else {
        content = null
      }
      return content
  };
  inviteToGroupView = () => {
    const {groupModel, userModel} = this.props
    let content = null
    if(groupModel){
      content =
      <div className="groupSettings">
        <h2>Invite a user to {this.props.groupModel.name}!</h2>
        <Formsy.Form
          onValid = {this.enableButton}
          onInvalid = {this.disableButton}
          onValidSubmit = {this.submitForm}>

          <FormsyText style={{display: 'block'}}
            name = 'name'
            required hintText = "Username or Email"
            floatingLabelText = "Invite a user to your group"
          />

          <RaisedButton
            type = "submit"
            label = "Submit"
            disabled = {!this.state.canSubmit}
          />
        </Formsy.Form>
        <Table
         height='300px'
         onRowSelection={this.onRowSelection}
        >
            <TableHeader >
              <TableRow>
                <TableHeaderColumn colSpan="3" tooltip='' style={{textAlign: 'center'}}>
                  Current Users (Limit 4)
                </TableHeaderColumn>
              </TableRow>
              <TableRow>
                <TableHeaderColumn tooltip='The Name'>Name</TableHeaderColumn>
                <TableHeaderColumn tooltip='The Username'>Username</TableHeaderColumn>
                <TableHeaderColumn tooltip='The Email'>Email</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              showRowHover={true}
            >
            {groupModel.users.map((user, i) =>
              <TableRow>
                <TableRowColumn key={user.name + i}>{user.name}</TableRowColumn>
                <TableRowColumn key={user.username}>{user.username}</TableRowColumn>
                <TableRowColumn key={user.email}>{user.email}</TableRowColumn>
              </TableRow>
              )
            }
            </TableBody>
          </Table>
          <RaisedButton
            type = "submit"
            label = "Leave Group"
            onTouchTap = {this.leaveGroupHandler}
          />
        </div>
    }
    return content
  };
  render() {
    const {groupModel, userModel} = this.props
    if(!this.props.jwt){
      return (
        <p>Loading</p>
      )
    }
    return(
      <div className="groupPage">
        {(()=> {
          if(!groupModel){
            return <h2>Invites </h2>
          }
        })()}
        {this.inviteView()}
        {this.createGroupView()}
        {this.inviteToGroupView()}
    </div>
    )
  }
}
let mapStateToProps = (state) => {
  return {
    jwt: state.logged.jwt,
    groupModel: state.logged.groupModel,
    userModel: state.logged.userModel
  }
}
export default connect(mapStateToProps)(Group)
