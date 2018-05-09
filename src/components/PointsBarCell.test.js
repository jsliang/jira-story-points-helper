import React from 'react';
import { render } from 'enzyme';

import PointsBarCell from './PointsBarCell';

describe('PointsBarCell', function() {
  it('should render without throwing an error', function() {
    expect(render(<PointsBarCell />)).toMatchSnapshot();
  });

  it('should render with props', function() {
    expect(
      render(<PointsBarCell points={5} percentage={0.5} status="new" />)
    ).toMatchSnapshot();
  });
});
