import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: ''
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    const listenEscKey = e => {
      e = e || window.event;
      if (e.keyCode === 27) {
        this.handleClose();
      }
    };

    document.onkeydown = listenEscKey;
  }

  handleClose() {
    this.handleSearch('');
    document.onkeydown = null;
    this.props.onClose();
  }

  handleChange(e) {
    this.setState({
      keyword: e.target.value
    });
    this.handleSearch(e.target.value);
  }

  handleSearch(keyword) {}

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      if (this.props.username.length > 0) {
        this.props.history.push(`/wall/${this.props.username[0].username}`);
        this.handleClose();
      }
    }
  }

  render() {
    const mapDataToLinks = data => {};

    return (
      <div className="search-screen white-text">
        <div className="right">
          <a
            className="waves-effect waves-light btn red lighten-1"
            onClick={this.handleClose}
          >
            CLOSE
          </a>
        </div>
        <div className="container">
          <input
            placeholder="Search a user"
            value={this.state.keyword}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
          <ul className="search-results">
            {mapDataToLinks(this.props.usernames)}
          </ul>
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  onClose: PropTypes.func,
  onSearch: PropTypes.func,
  username: PropTypes.array
};

Search.defaultProps = {
  onClose: () => {
    console.error('onClose function not defined');
  },
  onSearch: () => {
    console.error('onSearch function not defined');
  },
  username: {}
};
