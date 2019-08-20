function update() {
  startRender();
  // ...
  endRender();
}

function startGame() {
  let timeout = 50;
  setInterval(update, timeout);
}
