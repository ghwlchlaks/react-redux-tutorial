import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
const $ = window.$;

export default class Memo extends Component {
  componentDidMount() {
    $('#dropdown-button-' + this.props.data._id).dropdown({
      belowOrigin: true
    });
  }

  componentDidUpdate() {
    $('#dropdown-button-' + this.props.data._id).dropdown({
      belowOrigin: true
    });
  }
  render() {
    const { data, ownership } = this.props;

    const dropDownMenu = (
      <div className="option-button">
        <a
          className="dropdown-button"
          id={`dropdown-button-${data._id}`}
          data-activates={`dropdown-${data._id}`}
        >
          <i className="material-icons icon-button">more_vert</i>
        </a>
        <ul id={`dropdown-${data._id}`} className="dropdown-content">
          <li>
            <a>Edit</a>
          </li>
          <li>
            <a>Remove</a>
          </li>
        </ul>
      </div>
    );
    const memoView = (
      <div className="card">
        <div className="info">
          <a className="username">{data.writer}</a> wrote a log ·{' '}
          <TimeAgo date={data.date.created} />
          {ownership ? dropDownMenu : undefined}
        </div>
      </div>
    );

    return (
      <div className="container memo">
        <div className="card">
          {memoView}
          <div className="card-content">{data.contents}</div>
          <div className="footer">
            <i className="material-icons log-footer-icon star icon-button">
              star
            </i>
            <span className="star-count">{data.starred.length}</span>
          </div>
        </div>
      </div>
    );
  }
}

Memo.propTypes = {
  data: PropTypes.object,
  ownership: PropTypes.bool
};

Memo.defaultProps = {
  data: {
    _id: '123456789',
    writer: 'Writer',
    contenst: 'Contents',
    is_edited: false,
    date: {
      edited: new Date(),
      created: new Date()
    },
    starred: []
  },
  ownership: true
};
