import * as types from '../actions/ActionTypes';
// 배열을 수정할땐 불변성을 유지해야함. 이때 사용하는 immutable 라이브러리
/**
 * 사용방법
 * update()메소드의 첫 파라미터는 처리할 객체, 두번째 파라미터를 처리할 명령어
 * ex) update(prevState, {
 *  prevState.key : {$set: newState.value}
 * })
 */
import update from 'react-addons-update';

const initialState = {
  login: {
    status: 'INIT'
  },
  register: {
    status: 'INIT',
    error: -1
  },
  status: {
    valid: false,
    isLoggedIn: false,
    currentUser: ''
  }
};

export default function authentication(state, action) {
  if (typeof state === 'undefined') {
    state = initialState;
  }

  switch (action.type) {
  // login
  case types.AUTH_LOGIN:
    return update(state, {
      login: {
        status: { $set: 'WAITING' }
      }
    });
  case types.AUTH_LOGIN_SUCCESS:
    return update(state, {
      login: {
        status: { $set: 'SUCCESS' }
      },
      status: {
        isLoggedIn: { $set: true },
        currentUser: { $set: action.username }
      }
    });
  case types.AUTH_LOGIN_FAILURE:
    return update(state, {
      login: {
        status: { $set: 'FAILURE' }
      }
    });
  case types.AUTH_REGISTER:
    return update(state, {
      register: {
        status: { $set: 'WAITING' },
        error: { $set: -1 }
      }
    });
  case types.AUTH_REGISTER_SUCCESS:
    return update(state, {
      register: {
        status: { $set: 'SUCCESS' }
      }
    });
  case types.AUTH_REGISTER_FAILURE:
    return update(state, {
      register: {
        status: { $set: 'FAILURE' },
        error: { $set: action.error }
      }
    });
  case types.AUTH_GET_STATUS:
    return update(state, {
      status: {
        isLoggedIn: { $set: true }
      }
    });
  case types.AUTH_GET_STATUS_SUCCESS:
    return update(state, {
      status: {
        valid: { $set: true },
        currentUser: { $set: action.username }
      }
    });
  case types.AUTH_GET_STATUS_FAILURE:
    return update(state, {
      status: {
        valid: { $set: false },
        isLoggedIn: { $set: false }
      }
    });
  case types.AUTH_LOGOUT:
    return update(state, {
      status: {
        isLoggedIn: { $set: false },
        currentUser: { $set: '' }
      }
    });
  default:
    return state;
  }
}
