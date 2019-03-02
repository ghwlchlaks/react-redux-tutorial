/**
 * 순서 action -> reducer -> store -> components
 * action : 어떤 변화가 일어날지 알려주는 객체
 * reducer : action의 정보를 받고 애플리케이션의 상태를 바꿀지 정의
 * store : 모든 데이터를 담고있는 객체, 중간자 역할
 */

import { INCREMENT, DECREMENT, SET_DIFF } from "../actions";
import { combineReducers } from "redux";

const counterInitialState = {
  value: 0,
  diff: 1
};

const counter = (state = counterInitialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return Object.assign({}, state, {
        value: state.value + state.diff
      });
    case DECREMENT:
      return Object.assign({}, state, {
        value: state.value - state.diff
      });
    case SET_DIFF:
      return Object.assign({}, state, {
        diff: action.diff
      });
    default:
      return state;
  }
};

const extra = (state = { value: "this_is_extra_reducer" }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const counterApp = combineReducers({
  counter,
  extra
});

export default counterApp;
