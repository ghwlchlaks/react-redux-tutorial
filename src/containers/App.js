import React, { Component } from 'react';
import { Header } from '../components';

export default class App extends Component {
  render() {
    let re = /(login|register)/;
    let isAuth = re.test(this.props.location.pathname);
    console.log(this.props.location.pathname);
    return (
      <div>
        {isAuth ? undefined : <Header />}
        {this.props.children}
      </div>
    );
  }
}
