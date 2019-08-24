var entities = [];

function updateEntity(e, updateData) {
  e.update(updateData);
}

function renderEntity(e, renderData) {
  e.render(renderData);
}

var camera = lookAt(new vec3(2, 3, -5), new vec3(0, 0, 0), new vec3(0, 1, 0));
// var camera = lookAt(new vec3(5, 5, 0), new vec3(0, 0, 0), new vec3(0, 1, 0));
var t = 0;

function update() {
  let size = 3; // Math.sin((t * 2 * Math.PI) / 10) * 10;
  camera = lookAt(
    new vec3(
      size * Math.sin((t * 2 * Math.PI) / 2),
      size * Math.cos((t * 2 * Math.PI) / 2),
      -4
    ),
    new vec3(0, 0, 0),
    new vec3(0, 1, 0)
  );
  // TODO
  let dt = 0.005;
  t += dt;

  startRender();

  let updateData = { dt: dt, time: t };
  entities.forEach(r => traverseEntities(r, e => updateEntity(e, updateData)));

  let renderData = { view: camera };
  entities.forEach(r => traverseEntities(r, e => renderEntity(e, renderData)));

  endRender();
}

function startGame() {
  let timeout = 50;
  setInterval(update, timeout);
  // entities = [];

  addEntity(
    hackWallCardEntity(new vec3(-1, 1, -1), new vec3(2), new vec3(0, 0, 2))
  );
  addEntity(
    hackWallCardEntity(new vec3(-1, -1, -1), new vec3(0, 2), new vec3(0, 0, 2))
  );
  addEntity(
    hackWallCardEntity(new vec3(1, -1, -1), new vec3(0, 2), new vec3(0, 0, 2))
  );
  addEntity(
    hackWallCardEntity(new vec3(-1, -1, 1), new vec3(2), new vec3(0, 2))
  );
}

function addEntity(r) {
  traverseEntities(r, e => e.start());
  entities.push(r);
}
