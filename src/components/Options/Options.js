import React from "react";
import { connect } from "react-redux";
// input값을 변경했을떄 발생하는 action을 가져옵니다.
import { setDiff } from "../../actions";

class Option extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      diff: "1"
    };

    this.onChangeDiff = this.onChangeDiff.bind(this);
  }

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.diff}
          onChange={this.onChangeDiff}
        />
      </div>
    );
  }

  //값이 변경될때 발생하는 이벤트
  onChangeDiff(e) {
    if (isNaN(e.target.value)) return;

    this.setState({ diff: e.target.value });

    if (e.target.value === "") {
      this.setState({ diff: "0" });
    }

    // mapDispatchToProps와 매핑된 onUpdateDiff를 통하여 새로운값을 dispatch합니다.
    this.props.onUpdateDiff(parseInt(e.target.value));
  }
}

let mapDispatchToProps = dispatch => {
  return {
    onUpdateDiff: value => dispatch(setDiff(value))
  };
};

Option = connect(
  undefined,
  mapDispatchToProps
)(Option);

export default Option;
