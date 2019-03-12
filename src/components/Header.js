import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Search from '../components/Search';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: false
    };

    this.toggleSearch = this.toggleSearch.bind(this);
  }

  toggleSearch() {
    this.setState({
      search: !this.state.search
    });
  }

  render() {
    const loginButton = (
      <li>
        <Link to="/login">
          <i className="material-icons">vpn_key</i>
        </Link>
      </li>
    );

    const logoutButton = (
      <li>
        <a onClick={this.props.onLogout}>
          <i className="material-icons">lock_open</i>
        </a>
      </li>
    );

    return (
      <div>
        <nav>
          <div className="nav-wrapper blue darken-1">
            <Link to="/" className="brand-logo center">
              MEMOPAD
            </Link>

            <ul>
              <li>
                <a onClick={this.toggleSearch}>
                  <i className="material-icons">search</i>
                </a>
              </li>
            </ul>

            <div className="right">
              <ul>{this.props.isLoggedIn ? logoutButton : loginButton}</ul>
            </div>
          </div>
        </nav>
        <ReactCSSTransitionGroup
          transitionName="search"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {/* IMPLEMENT: SHOW SEARCH WHEN SEARCH STATUS IS TRUE */}
          {this.state.search ? (
            <Search onClose={this.toggleSearch} />
          ) : (
            undefined
          )}
        </ReactCSSTransitionGroup>
      </div>
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
