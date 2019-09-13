const loadingTime = 7;
// const loadingTime = 0;

setTimeout(function() {
  loadSceneById(sceneList.length - 1, true);
}, loadingTime * 1000);
