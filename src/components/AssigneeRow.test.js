import React from 'react';
import { render } from 'enzyme';

import AssigneeRow from './AssigneeRow';

describe('AssigneeRow', function() {
  it('should render without throwing an error', function() {
    expect(render(<AssigneeRow />)).toMatchSnapshot();
  });

  it('should not render without points', function() {
    expect(render(<AssigneeRow name="User" />)).toMatchSnapshot();
  });

  it('should render with props', function() {
    expect(
      render(
        <AssigneeRow
          name="User"
          points={{ new: 1, indeterminate: 2, done: 3 }}
        />
      )
    ).toMatchSnapshot();
  });
});
