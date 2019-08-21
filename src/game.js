var entities = [];

function updateEntity(e, updateData) {
  e.update(updateData);
}

function renderEntity(e, renderData) {
  e.render(renderData);
}

// var camera = lookAt(new vec3(0, 0, -5), new vec3(0, 0, 0), new vec3(0, 1, 0));
var camera = lookAt(new vec3(0, 0, -1), new vec3(0, 0, 0), new vec3(0, 1, 0));
var t = 0;

function update() {
  let size = Math.sin((t * 2 * Math.PI) / 10) * 10;
  camera = lookAt(
    new vec3(
      size * Math.sin(t * 2 * Math.PI),
      3,
      -size * Math.cos(t * 2 * Math.PI)
    ),
    new vec3(0, 0, 0),
    new vec3(0, 1, 0)
  );
  t += 0.005;

  startRender();

  let updateData = {};
  entities.forEach(r => traverseEntities(r, e => updateEntity(e, updateData)));

  let renderData = { view: camera };
  entities.forEach(r => traverseEntities(r, e => renderEntity(e, renderData)));

  endRender();
}

function startGame() {
  let timeout = 50;
  setInterval(update, timeout);
}

function addEntity(r) {
  traverseEntities(r, e => e.start());
  entities.push(r);
}
