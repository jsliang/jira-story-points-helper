import React from 'react';
import { render } from 'react-dom';

import fetchData from './fetchData';
import Popover from './components/Popover';

const CONTAINER_ID = 'jira-story-points-helper';

// append container to body
(() => {
  const setElementId = (el, id) => {
    const attr = document.createAttribute('id');
    attr.value = id;
    el.setAttributeNode(attr);
  };

  const div = document.createElement('div');
  setElementId(div, CONTAINER_ID);

  document.body.appendChild(div);
})();

// fetch data and render the result in container
fetchData(function updateView(fetchTime, sprints) {
  render(
    <Popover
      doFetchData={fetchData(updateView)}
      fetchTime={fetchTime}
      sprints={sprints}
    />,
    document.getElementById(CONTAINER_ID),
  );
})();
