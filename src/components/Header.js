import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Header extends Component {
  render() {
    return (
      <nav>
        <div className="nav-wrapper blue darken-1">
          <a className="brand-logo center">MEMOPAD</a>

          <ul>
            <li>
              <a>
                <i className="material-icons">search</i>
              </a>
            </li>
          </ul>

          <div className="right">
            <ul>
              <li>
                <a>
                  <i className="material-icons">vpn_key</i>
                </a>
              </li>
              <li>
                <a>
                  <i className="material-icons">lock_open</i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  isLogginedIn: PropTypes.bool,
  onLogout: PropTypes.func
};

Header.defaultProps = {
  isLogginedIn: false,
  onLogout: () => {
    console.error("logout function not defined");
  }
};
