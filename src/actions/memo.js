import {
  MEMO_POST,
  MEMO_POST_FAILURE,
  MEMO_POST_SUCCESS,
  MEMO_LIST,
  MEMO_LIST_SUCCESS,
  MEMO_LIST_FAILURE
} from './ActionTypes';
import axios from 'axios';

// memo post
export function memoPostRequest(contents) {
  return dispatch => {
    dispatch(memoPost());

    return axios
      .post('/api/memo/', { contents })
      .then(response => {
        dispatch(memoPostSuccess());
      })
      .catch(error => {
        dispatch(memoPostFailure(error.response.data.code));
      });
  };
}

export function memoPost() {
  return {
    type: MEMO_POST
  };
}

export function memoPostSuccess() {
  return {
    type: MEMO_POST_SUCCESS
  };
}

export function memoPostFailure() {
  return {
    type: MEMO_POST_FAILURE
  };
}

/** memo list */
export function memoListRequest(isInitial, listType, id, username) {
  return dispatch => {
    dispatch(memoList());

    let url = '/api/memo';

    if (typeof username === 'undefined') {
      // 유저네임이 없다면 공통 메모 load
      url = isInitial ? url : `${url}/${listType}/${id}`;
    } else {
      // 특정 유저의 메모 가져오기 url
    }

    return axios
      .get(url)
      .then(response => {
        dispatch(memoListSuccess(response.data, isInitial, listType));
      })
      .catch(error => {
        dispatch(memoListFailure());
      });
  };
}

export function memoList() {
  return {
    type: MEMO_LIST
  };
}

export function memoListSuccess(data, isInitial, listType) {
  return {
    type: MEMO_LIST_SUCCESS,
    data,
    isInitial,
    listType
  };
}

export function memoListFailure() {
  return {
    type: MEMO_LIST_FAILURE
  };
}
