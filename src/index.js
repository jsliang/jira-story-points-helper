import $ from 'jquery';
import JiraTaskBoardHelper from './JiraTaskBoardHelper';

const getRapidViewId = url => {
  const re = /rapidView=(\d+)/;
  const m = re.exec(url);
  if (m) {
    return m[1];
  }
  return null;
};

$(document).ready(() => {
  const rapidViewId = getRapidViewId(window.location.search);
  const helper = new JiraTaskBoardHelper();
  helper.initPopover();
  helper.fetchAllData(rapidViewId);
});

