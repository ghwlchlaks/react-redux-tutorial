import {
  AUTH_LOGIN,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_SUCCESS,
  AUTH_REGISTER,
  AUTH_REGISTER_SUCCESS,
  AUTH_REGISTER_FAILURE
} from './ActionTypes';
import axios from 'axios';

/* Authentication */

/* 
login
thunk는 특정 작업의 처리를 미루기 위해서 함수로 wrapping하는 것 
loginRequest는 dispatch를 파라미터로 갖는 thunk를 리턴
*/
export function loginRequest(username, password) {
  return dispatch => {
    dispatch(login());

    return axios
      .post('/api/account/signin', { username, password })
      .then(response => {
        // 성공
        // thunk내부에서 다른 action을 dispatch할 수 있음.
        dispatch(loginSuccess(username));
      })
      .catch(error => {
        dispatch(loginFailure());
      });
  };
}

export function login() {
  return {
    type: AUTH_LOGIN
  };
}

export function loginSuccess(username) {
  return {
    type: AUTH_LOGIN_SUCCESS,
    username
  };
}

export function loginFailure() {
  return {
    type: AUTH_LOGIN_FAILURE
  };
}

/**
 * register
 */

export function registerRequest(username, password) {
  return dispatch => {
    dispatch(register());

    return axios
      .post('/api/account/signup', { username, password })
      .then(reponse => {
        dispatch(registerSuccess());
      })
      .catch(error => {
        dispatch(registerFailure(error.response.data.code));
      });
  };
}

export function register() {
  return {
    type: AUTH_REGISTER
  };
}

export function registerSuccess() {
  return {
    type: AUTH_REGISTER_SUCCESS
  };
}

export function registerFailure(error) {
  return {
    type: AUTH_REGISTER_FAILURE,
    error
  };
}
