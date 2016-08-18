import PureComponent from 'react-pure-render/component';
import React from 'react';
import { Map } from 'immutable';

class SummaryTable extends PureComponent {
  render() {
    const { assignees, pointsByAssignee } = this.props;
    return (
      <div>
        <p>{JSON.stringify(assignees)}</p>
        <p>{JSON.stringify(pointsByAssignee)}</p>
      </div>
    );
  }
}

SummaryTable.defaultProps = {
  assignees: Map(),
  pointsByAssignee: Map(),
};

export default SummaryTable;
