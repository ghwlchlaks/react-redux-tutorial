import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class Header extends Component {
  render() {
    const loginButton = (
      <li>
        <Link to="/">
          <i className="material-icons">vpn_key</i>
        </Link>
      </li>
    );

    const logoutButton = (
      <li>
        <Link to="/">
          <i className="material-icons">lock_open</i>
        </Link>
      </li>
    );

    return (
      <nav>
        <div className="nav-wrapper blue darken-1">
          <Link to="/" className="brand-logo center">
            MEMOPAD
          </Link>

          <ul>
            <li>
              <Link to="/">
                <i className="material-icons">search</i>
              </Link>
            </li>
          </ul>

          <div className="right">
            <ul>{this.props.isLoggedIn ? logoutButton : loginButton}</ul>
          </div>
        </div>
      </nav>
    );
  }
}
/**
 * isLogginedIn : 로그인 유무,
 * onLogout : 함수형 props로 로그아웃을 담당
 */

Header.propTypes = {
  isLogginedIn: PropTypes.bool,
  onLogout: PropTypes.func
};

Header.defaultProps = {
  isLogginedIn: false,
  onLogout: () => {
    console.error('logout function not defined');
  }
};
