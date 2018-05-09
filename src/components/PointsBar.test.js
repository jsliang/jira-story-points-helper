import React from 'react';
import { render } from 'enzyme';

import PointsBar from './PointsBar';

describe('PointsBar', function() {
  it('should render without throwing an error', function() {
    expect(render(<PointsBar />)).toMatchSnapshot();
  });

  it('should render with props', function() {
    expect(
      render(<PointsBar points={{ new: 1, indeterminate: 2, done: 3 }} />)
    ).toMatchSnapshot();
  });

  it('should render with just `new`', function() {
    expect(render(<PointsBar points={{ new: 1 }} />)).toMatchSnapshot();
  });

  it('should render with just `indeterminate`', function() {
    expect(
      render(<PointsBar points={{ indeterminate: 2 }} />)
    ).toMatchSnapshot();
  });

  it('should render with just `done`', function() {
    expect(render(<PointsBar points={{ done: 3 }} />)).toMatchSnapshot();
  });
});
