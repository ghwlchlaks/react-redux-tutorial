import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Write, MemoList } from '../components';
import { memoPostRequest, memoListRequest } from '../actions/memo';

const $ = window.$;
const Materialize = window.Materialize;

class Home extends Component {
  constructor(props) {
    super(props);

    this.handlePost = this.handlePost.bind(this);
  }

  componentDidMount() {
    this.props.memoListRequest(true).then(() => {
      console.log(this.props.memoData);
    });
  }

  handlePost(contents) {
    return this.props.memoPostRequest(contents).then(() => {
      if (this.props.postStatus.status === 'SUCCESS') {
        Materialize.toast('Success!', 2000);
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
    memoData: state.memo.list.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    memoPostRequest: contents => {
      return dispatch(memoPostRequest(contents));
    },
    memoListRequest: (isInitial, listType, id, username) => {
      return dispatch(memoListRequest(isInitial, listType, id, username));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
