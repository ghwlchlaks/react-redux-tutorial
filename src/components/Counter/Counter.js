import React from "react";
// react-redux의 내장 api, Redux store에 연결
import { connect } from "react-redux";

class Counter extends React.Component {
  render() {
    return <h1>VALUE: {this.props.value}</h1>;
  }
}

// store의 state를 컴포넌트의 props에 매핑
// counter의 state값을 변경해주어야하므로 정의
let mapStateToProps = state => {
  return {
    value: state.counter.value
  };
};

// 컴포넌트를 store에 연결
Counter = connect(mapStateToProps)(Counter);

export default Counter;
