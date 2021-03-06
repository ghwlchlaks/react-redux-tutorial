import {
  AUTH_LOGIN,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_SUCCESS,
  AUTH_REGISTER,
  AUTH_REGISTER_SUCCESS,
  AUTH_REGISTER_FAILURE,
  AUTH_GET_STATUS,
  AUTH_GET_STATUS_SUCCESS,
  AUTH_GET_STATUS_FAILURE,
  AUTH_LOGOUT
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
      .post('/api/auth/signin', { username, password })
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
      .post('/api/auth/signup', { username, password })
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

/**
 * get login status
 */
export function getStatusRequest() {
  return dispatch => {
    dispatch(getStatus());

    return axios
      .get('/api/auth/getInfo')
      .then(response => {
        dispatch(getStatusSuccess(response.data.info.username));
      })
      .catch(error => {
        dispatch(getStatusFailure());
      });
  };
}

export function getStatus() {
  return {
    type: AUTH_GET_STATUS
  };
}

export function getStatusSuccess(username) {
  return {
    type: AUTH_GET_STATUS_SUCCESS,
    username
  };
}

export function getStatusFailure() {
  return {
    type: AUTH_GET_STATUS_FAILURE
  };
}

/**
 * logout
 */

export function logoutRequest() {
  return dispatch => {
    return axios.post('/api/auth/logout').then(response => {
      dispatch(logout());
    });
  };
}

export function logout() {
  return {
    type: AUTH_LOGOUT
  };
}
