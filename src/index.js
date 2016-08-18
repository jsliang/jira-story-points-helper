import request from 'superagent';

const getRapidViewId = url => {
  const re = /rapidView=(\d+)/;
  const m = re.exec(url);
  if (m) {
    return m[1];
  }
  return null;
};

document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
    const rapidViewId = getRapidViewId(tabs[0].url);
    request
      .get(`https://appier.atlassian.net/rest/greenhopper/1.0/xboard/work/allData.json?rapidViewId=${rapidViewId}`)
      .withCredentials()
      .then(res => {
        document.getElementById('app').innerHTML = res.body;
      });
  });
});
