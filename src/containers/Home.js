import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Write, MemoList } from '../components';
import {
  memoPostRequest,
  memoListRequest,
  memoEditRequest,
  memoRemoveRequest
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

    this.state = {
      loadingState: false
    };
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

    this.props.memoListRequest(true).then(() => {
      console.log(this.props.memoData);
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

    this.props.memoListRequest(true).then(() => {
      loadUntilScrollable();
      loadMemoLoop();
    });
  }

  componentWillUnmount() {
    clearTimeout(this.memoLoaderTimeoutId);
    $(window).unbind();
  }

  loadOldMemo() {
    if (this.props.isLast) {
      return new Promise((resolve, reject) => {
        resolve();
      });
    }

    let lastId = this.props.memoData[this.props.memoData.length - 1]._id;

    return this.props.memoListRequest(false, 'old', lastId).then(() => {
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
      return this.props.memoListRequest(true);
    } else {
      return this.props.memoListRequest(
        false,
        'new',
        this.props.memoData[0]._id
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
    const write = <Write onPost={this.handlePost} />;

    return (
      <div className="wrapper">
        {this.props.isLoggedIn ? write : undefined}
        <MemoList
          data={this.props.memoData}
          currentUser={this.props.currentUser}
          onEdit={this.handleEdit}
          onRemove={this.handleRemove}
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
    removeStatus: state.memo.remove
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
