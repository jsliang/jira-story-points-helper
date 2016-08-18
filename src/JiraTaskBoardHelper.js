import $ from 'jquery';
import request from 'superagent';

class JiraTaskBoardHelper {
  constructor() {
  }

  initPopover() {
    const popoverStyle = [
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
    $('body').append(`
      <div id='jira-taskboard-helper' style='${popoverStyle.join(' ')}'></div>
    `);
  }

  fetchAllData(rapidViewId) {
    request
      .get(`https://appier.atlassian.net/rest/greenhopper/1.0/xboard/work/allData.json?rapidViewId=${rapidViewId}`)
      .withCredentials()
      .then(res => {
        this.allData = res.body;
        this.updateView();
      });
  }

  updateView() {
    console.log(this.allData);
  }
}

export default JiraTaskBoardHelper;
