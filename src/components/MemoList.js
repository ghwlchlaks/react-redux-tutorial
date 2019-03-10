import React, { Component } from 'react';
import { Memo } from '../components';
import PropTypes from 'prop-types';

export default class MemoList extends Component {
  render() {
    const mapToComponents = data => {
      return data.map((memo, i) => {
        return (
          <Memo
            data={memo}
            ownership={memo.writer === this.props.currentUser}
            key={memo._id}
            index={i}
            onEdit={this.props.onEdit}
          />
        );
      });
    };
    return <div>{mapToComponents(this.props.data)}</div>;
  }
}

MemoList.propTypes = {
  data: PropTypes.array,
  currentUser: PropTypes.string,
  onEdit: PropTypes.func
};

MemoList.defaultProps = {
  data: [],
  currentUser: '',
  onEdit: (id, index, contents) => {
    console.error('edit function not defined')
  }
};
