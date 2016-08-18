import PureComponent from 'react-pure-render/component';
import React from 'react';
import { Map } from 'immutable';

class SummaryTable extends PureComponent {
  render() {
    const { assignees, pointsByAssignee } = this.props;

    const popoverStyle = {
      alignItems: 'stretch',
      backgroundColor: '#fff',
      bottom: 0,
      boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      fontSize: '15px',
      left: '10px',
      position: 'fixed',
      zIndex: 100,
    };

    return (
      <div style={popoverStyle}>
        <table style={{ borderCollapse: 'separate', borderSpacing: '6px', margin: '5px' }}>
          <thead>
            <tr>
              <th>Assignee</th>
              <td>new</td>
              <td>indeterminate</td>
              <td>done</td>
            </tr>
          </thead>
          <tbody>
          {
            assignees
              .valueSeq()
              .sortBy(assignee => assignee.get('name'))
              .map(assignee => {
                const assigneeId = assignee.get('id');
                const points = pointsByAssignee.get(assigneeId);

                if (points.get('new') || points.get('intermediate') || points.get('done')) {
                  return (
                    <tr key={assigneeId}>
                      <td>
                        <div className="ghx-avatar">
                          <img
                            src={assignee.get('avatarUrl')}
                            className="ghx-avatar-img"
                            alt={`Assignee: ${assignee.get('name')}`}
                          />
                        </div>
                      </td>
                      <td>{points.get('new')}</td>
                      <td>{points.get('indeterminate')}</td>
                      <td>{points.get('done')}</td>
                    </tr>
                  );
                }

                return null;
              })
              .toJS()
          }
          </tbody>
        </table>
      </div>
    );
  }
}

SummaryTable.defaultProps = {
  assignees: Map(),
  pointsByAssignee: Map(),
};

export default SummaryTable;
