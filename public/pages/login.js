/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import React, { Component } from 'react';

import Login from '../components/Login'

export default class extends Component {

  render() {
    return (
      <div>
        <h1>Login</h1>
        <Login />
      </div>
    );
  }

}
