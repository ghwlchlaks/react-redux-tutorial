// 특정유저의 게시글만 보여주는 컴포넌트
import { Home } from './index';
import React, { Component } from 'react';

export default class Wall extends Component {
  render() {
    return <Home username={this.props.match.params.username} />;
  }
}
