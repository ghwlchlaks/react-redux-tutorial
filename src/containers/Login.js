import React, { Component } from 'react';
import { Authentication } from '../components';
import { connect } from 'react-redux';
import { loginRequest } from '../actions/authentication';
const $ = window.$;
const Materialize = window.Materialize;

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(id, pw) {
    return this.props.loginRequest(id, pw).then(() => {
      if (this.props.status === 'SUCCESS') {
        // 로그인 성공 시 세션 생성
        let loginData = {
          isLoggedIn: true,
          username: id
        };

        document.cookie = 'keys=' + btoa(JSON.stringify(loginData));
        Materialize.toast('Welcome, ' + id, 2000);
        this.props.history.push('/');
        return true;
      } else {
        let $toastContent = $(
          '<span style="color: #FFB4BA">Incorrect username or password</span>'
        );
        Materialize.toast($toastContent, 2000);
        return false;
      }
    });
  }

  render() {
    return (
      <div>
        <Authentication mode={true} onLogin={this.handleLogin} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: state.authentication.login.status
  };
};

// 컴포넌트에서 특정 요청이 발생했을때 예) loginRequest, 지정한 action을 dispatch하도록 설정
const mapDispatchToProps = dispatch => {
  return {
    loginRequest: (id, pw) => {
      return dispatch(loginRequest(id, pw));
    }
  };
};

// connect를 이용하여 login 컴포넌트를 redux(store)에 연결
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
