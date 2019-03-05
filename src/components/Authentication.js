import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class Authentication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    let id = this.state.username;
    let pw = this.state.password;

    // login 컴포넌트에서 전달받은 메소드
    this.props.onLogin(id, pw).then(success => {
      // 로그인 실패시 패스워드초기화
      if (!success) {
        this.setState({
          password: ''
        });
      }
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const inputBoxes = (
      <div>
        <div className="input-field col s12 username">
          <label>Username</label>
          <input
            name="username"
            type="text"
            className="validate"
            onChange={this.handleChange}
            value={this.state.username}
          />
        </div>
        <div className="input-field col s12">
          <label>Password</label>
          <input
            name="password"
            type="password"
            className="validate"
            onChange={this.handleChange}
            value={this.state.password}
          />
        </div>
      </div>
    );

    const loginView = (
      <div>
        <div className="card-content">
          <div className="row">
            {inputBoxes}
            <a
              className="waves-effect waves-light btn"
              onClick={this.handleLogin}
            >
              SUBMIT
            </a>
          </div>
        </div>

        <div className="footer">
          <div className="card-content">
            <div className="right">
              New Here? <Link to="/register">Create an account</Link>
            </div>
          </div>
        </div>
      </div>
    );

    const registerView = (
      <div className="card-content">
        <div className="row">
          {inputBoxes}
          <a className="waves-effect waves-light btn">CREATE</a>
        </div>
      </div>
    );

    return (
      <div className="container auth">
        <Link className="logo" to="/">
          MEMOPAD
        </Link>
        <div className="card">
          <div className="header blue white-text center">
            <div className="card-content">
              {this.props.mode ? 'LOGIN' : 'REGISTER'}
            </div>
          </div>
          {this.props.mode ? loginView : registerView}
        </div>
      </div>
    );
  }
}

Authentication.propTypes = {
  mode: PropTypes.bool,
  onLogin: PropTypes.func,
  onRegister: PropTypes.func
};

Authentication.defaultProps = {
  mode: true,
  onLogin: (id, pw) => {
    console.error('login function not defined');
  },
  onRegister: (id, pw) => {
    console.error('register function not defined');
  }
};
