import React, { Component } from 'react'

import Title from './Title'
import Navigation from './Navigation'
import Footer from './Footer'

export default class Layout extends Component {
  render() {
    const { title } = this.props

    return(
      <div>
        <Navigation />
        <Title title={title} />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}
