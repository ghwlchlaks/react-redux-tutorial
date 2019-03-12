import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Write, MemoList } from '../components';
import PropTypes from 'prop-types';
import {
  memoPostRequest,
  memoListRequest,
  memoEditRequest,
  memoRemoveRequest,
  memoStarRequest
} from '../actions/memo';

const $ = window.$;
const Materialize = window.Materialize;

class Home extends Component {
  constructor(props) {
    super(props);

    this.handlePost = this.handlePost.bind(this);
    this.loadNewMemo = this.loadNewMemo.bind(this);
    this.loadOldMemo = this.loadOldMemo.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleStar = this.handleStar.bind(this);

    this.state = {
      loadingState: false,
      initiallyLoaded: false
    };
  }

  handleStar(id, index) {
    this.props.memoStarRequest(id, index).then(() => {
      if (this.props.starStatus.status !== 'SUCCESS') {
        let errorMessage = [
          'something broke',
          'you are not logged in',
          'that memo does not exist'
        ];

        let $toastContent = $(
          '<span style="color: #FFB4BA">' +
            errorMessage[this.props.starStatus.error - 1] +
            '</span>'
        );
        Materialize.toast($toastContent, 2000);

        //check logged in
        if (this.props.starStatus.error === 2) {
          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
        }
      }
    });
  }

  handleRemove(id, index) {
    this.props.memoRemoveRequest(id, index).then(() => {
      if (this.props.removeStatus.status === 'SUCCESS') {
        setTimeout(() => {
          if ($('body').height() < $(window).height()) {
            this.loadOldMemo();
          }
        }, 1000);
      } else {
        let errorMessage = [
          'something broke',
          'you are not logged in',
          'that memo does not exist',
          'you do not have permission'
        ];

        let $toastContent = $(
          '<span style="color: #FFB4BA">' +
            errorMessage[this.props.removeStatus.error - 1] +
            '</span>'
        );
        Materialize.toast($toastContent, 2000);

        // if not logged in
        if (this.props.removeStatus.error === 2) {
          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
        }
      }
    });
  }

  handleEdit(id, index, contents) {
    return this.props.memoEditRequest(id, index, contents).then(() => {
      if (this.props.editStatus.status === 'SUCCESS') {
        Materialize.toast('Success!', 2000);
      } else {
        let errorMessage = [
          'something broke',
          'please write something',
          'you are not logged in',
          'that memo does not exist anymore',
          'you do not have permission'
        ];

        let error = this.props.editStatus.error;

        let $toastContent = $(
          '<span style="color: #FFB4BA">' + errorMessage[error - 1] + '</span>'
        );
        Materialize.toast($toastContent, 2000);

        if (error === 3) {
          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
        }
      }
    });
  }

  componentDidMount() {
    // load new memo every 5 secondes
    const loadMemoLoop = () => {
      this.loadNewMemo().then(() => {
        this.memoLoaderTimeoutId = setTimeout(loadMemoLoop, 5000);
      });
    };

    this.props
      .memoListRequest(true, undefined, undefined, this.props.username)
      .then(() => {
        this.setState({
          initiallyLoaded: true
        });
        setTimeout(loadUntilScrollable, 1000);
        loadMemoLoop();
      });

    $(window).scroll(() => {
      if (
        $(document).height() - $(window).height() - $(window).scrollTop() <
        250
      ) {
        if (!this.state.loadingState) {
          this.loadOldMemo();
          this.setState({
            loadingState: true
          });
        }
      } else {
        if (this.state.loadingState) {
          this.setState({
            loadingState: false
          });
        }
      }
    });

    const loadUntilScrollable = () => {
      if ($('body').height() < $(window).height()) {
        this.loadOldMemo().then(() => {
          if (!this.props.isLast) {
            loadUntilScrollable();
          }
        });
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.username !== prevProps.username) {
      this.componentWillUnmount();
      this.componentDidMount();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.memoLoaderTimeoutId);
    $(window).unbind();
    this.setState({
      initiallyLoaded: false
    });
  }

  loadOldMemo() {
    if (this.props.isLast) {
      return new Promise((resolve, reject) => {
        resolve();
      });
    }

    let lastId = this.props.memoData[this.props.memoData.length - 1]._id;

    return this.props
      .memoListRequest(false, 'old', lastId, this.props.username)
      .then(() => {
        if (this.props.isLast) {
          Materialize.toast('you are reading the last page', 2000);
        }
      });
  }

  loadNewMemo() {
    if (this.props.listStatus === 'WAITING') {
      return new Promise((resolve, reject) => {
        resolve();
      });
    }

    if (this.props.memoData.length === 0) {
      return this.props.memoListRequest(
        true,
        undefined,
        undefined,
        this.props.username
      );
    } else {
      return this.props.memoListRequest(
        false,
        'new',
        this.props.memoData[0]._id,
        this.props.username
      );
    }
  }

  handlePost(contents) {
    return this.props.memoPostRequest(contents).then(() => {
      if (this.props.postStatus.status === 'SUCCESS') {
        // tigger new memo
        this.loadNewMemo().then(() => {
          Materialize.toast('Success!', 2000);
        });
      } else {
        /**
         * 1: not logged in
         * 2: empty contents
         */
        let $toastContent;
        switch (this.props.postStatus.error) {
        case 1:
          $toastContent = $(
            '<span style="color: #FFB4BA">You are not logged in</span>'
          );
          Materialize.toast($toastContent, 2000);
          setTimeout(() => {
            window.location.reload(false);
          }, 2000);
          break;
        case 2:
          $toastContent = $(
            '<span style="color: #FFB4BA">Please write something</span>'
          );
          Materialize.toast($toastContent, 2000);
          break;
        default:
          $toastContent = $(
            '<span style="color: #FFB4BA">Something Broke</span>'
          );
          Materialize.toast($toastContent, 2000);
          break;
        }
      }
    });
  }

  render() {
    const emptyView = (
      <div className="container">
        <div className="empty-page">
          <b>{this.props.username}</b> isn't registered or hasn't written any
          memo
        </div>
      </div>
    );

    const wallHeader = (
      <div>
        <div className="container wall-info">
          <div className="card wall-info blue lighten-2 white-text">
            <div className="card-content">{this.props.username}</div>
          </div>
        </div>
        {this.props.memoData.length === 0 && this.state.initiallyLoaded
          ? emptyView
          : undefined}
      </div>
    );

    const write = <Write onPost={this.handlePost} />;

    return (
      <div className="wrapper">
        {typeof this.props.username !== 'undefined' ? wallHeader : undefined}
        {this.props.isLoggedIn && typeof this.props.username === 'undefined'
          ? write
          : undefined}
        <MemoList
          data={this.props.memoData}
          currentUser={this.props.currentUser}
          onEdit={this.handleEdit}
          onRemove={this.handleRemove}
          onStar={this.handleStar}
        />
      </div>
    );
  }
}

// store에서 isLoggedIn 값가져오기
const mapStateToProps = state => {
  return {
    isLoggedIn: state.authentication.status.isLoggedIn,
    postStatus: state.memo.post,
    currentUser: state.authentication.status.currentUser,
    memoData: state.memo.list.data,
    listStatus: state.memo.list.status,
    isLast: state.memo.list.isLast,
    editStatus: state.memo.edit,
    removeStatus: state.memo.remove,
    starStatus: state.memo.star
  };
};

const mapDispatchToProps = dispatch => {
  return {
    memoPostRequest: contents => {
      return dispatch(memoPostRequest(contents));
    },
    memoListRequest: (isInitial, listType, id, username) => {
      return dispatch(memoListRequest(isInitial, listType, id, username));
    },
    memoEditRequest: (id, index, contents) => {
      return dispatch(memoEditRequest(id, index, contents));
    },
    memoRemoveRequest: (id, index) => {
      return dispatch(memoRemoveRequest(id, index));
    },
    memoStarRequest: (id, index) => {
      return dispatch(memoStarRequest(id, index));
    }
  };
};

Home.propTypes = {
  username: PropTypes.string
};

Home.defaultProps = {
  username: undefined
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
