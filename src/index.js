import JiraTaskBoardHelper from './JiraTaskBoardHelper';

const getRapidViewId = url => {
  const re = /rapidView=(\d+)/;
  const m = re.exec(url);
  if (m) {
    return m[1];
  }
  return null;
};

const rapidViewId = getRapidViewId(window.location.search);
const helper = new JiraTaskBoardHelper();
helper.fetchData(rapidViewId);
