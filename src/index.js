import $ from 'jquery';
import request from 'superagent';

const getRapidViewId = url => {
  const re = /rapidView=(\d+)/;
  const m = re.exec(url);
  if (m) {
    return m[1];
  }
  return null;
};

$(document).ready(() => {
  debugger;
  const rapidViewId = getRapidViewId(window.location.search);
  request
    .get(`https://appier.atlassian.net/rest/greenhopper/1.0/xboard/work/allData.json?rapidViewId=${rapidViewId}`)
    .withCredentials()
    .then(res => {
      const boxStyle = [
        'align-items: stretch;',
        'background-color: #fff;',
        'bottom: 10px;',
        'box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);',
        'display: flex;',
        'font-size: 15px;',
        'left: 0;',
        'position: fixed;',
        'z-index: 100;',
      ];
      console.log(res.body);
      $('body').append(`
        <div id='jira-taskboard-helper' style='${boxStyle.join(' ')}'>
          ${res.body}
        </div>
      `);
    });
});

