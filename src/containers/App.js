import React, { Component } from 'react';
import { Header } from '../components';
import { connect } from 'react-redux';
import { getStatusRequest } from '../actions/authentication';
const $ = window.$;
const Materialize = window.Materialize;

class App extends Component {
  componentDidMount() {
    // 세션 확인 기능
    function getCookie(name) {
      const value = '; ' + document.cookie;
      const parts = value.split('; ' + name + '=');
      if (parts.length === 2) {
        return parts
          .pop()
          .split(';')
          .shift();
      }
    }

    // 쿠키에서 로그인 데이터 가져오기
    let loginData = getCookie('key');

    // 쿠키에 loginData가 없을때
    if (typeof loginData === 'undefined') {
      return;
    }

    // 쿠키에 loginData를 디코딩
    loginData = JSON.parse(atob(loginData));

    // 쿠키에 로그인 유무가 false일때 (로그인 처리 x일때)
    if (!loginData.isLoggedIn) {
      return;
    }

    this.props.getStatusRequest().then(() => {
      console.log(this.props.status);

      // 서버 세션 검사 결과 false일때
      if (!this.props.status.valid) {
        // 쿠키 제거
        loginData = {
          isLoggedIn: false,
          username: ''
        };
      }

      document.cookie = 'key=' + btoa(JSON.stringify(loginData));

      let $toastContent = $(
        '<span style="color: #FFB4BA">Your session is expired, please log in again</span>'
      );
      Materialize.toast($toastContent, 4000);
    });
  }

  render() {
    let re = /(login|register)/;
    let isAuth = re.test(this.props.location.pathname);

    return (
      <div>
        {isAuth ? (
          undefined
        ) : (
          <Header isLoggedIn={this.props.status.isLoggedIn} />
        )}
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: state.authentication.status
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
