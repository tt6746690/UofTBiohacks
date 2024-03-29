// Libraries
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect,  } from 'react-redux'

// Components
import BSContainer from '../components/BSContainer'
import Snackbar from 'material-ui/lib/snackbar'

import '../styles/index.scss'

// Actions
import * as LoggedActions from '../actions/logged'

class Index extends Component {
  render() {
    // TODO snack.open, message at state root
    const { children, open, message } = this.props
    const { eatSnack } = this.props.actions

    return(
      <div className="appWrapper fillY">
        {children}

        <Snackbar
          open={open}
          message={message}
          action="close"
          autoHideDuration={3000}
          onActionTouchTap={eatSnack}
          onRequestClose={eatSnack}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    open: state.logged.snackbar.open,
    message: state.logged.snackbar.message
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(LoggedActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
