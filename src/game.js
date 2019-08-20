var entities = [];

function updateEntity(e, updateData) {
  e.update(updateData);
}

function renderEntity(e, renderData) {
  e.update(renderData);
}

function update() {
  startRender();

  let updateData = {};
  entities.forEach(r => traverseEntities(r, e => updateEntity(e, updateData)));

  let renderData = {};
  entities.forEach(r => traverseEntities(r, e => renderEntity(e, renderData)));

  endRender();
}

function startGame() {
  let timeout = 50;
  setInterval(update, timeout);
}

function addEntity(e) {
  e.start();
  entities.push(e);
}
