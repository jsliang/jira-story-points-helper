
document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    document.getElementById('app').innerHTML = tabs[0].url;
  });
});
