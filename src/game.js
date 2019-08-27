var fpsLabel = document.getElementById("f");

var entities = [];

function updateEntity(e, updateData) {
  e.update(updateData);
}

function renderEntity(e, renderData) {
  e.render(renderData);
}

var camera = lookAt(new vec3(2, 3, -5), new vec3(0, 0, 0), new vec3(0, 1, 0));
// var camera = lookAt(new vec3(5, 5, 0), new vec3(0, 0, 0), new vec3(0, 1, 0));
var startTime;
var t = 0;

const writeFpsCount = 10;
var writeFps = 0;
var fpsTime = 0;
const targetFps = 60;

function update() {
  let elapsed = new Date() - startTime;
  startTime = new Date();
  fpsTime += elapsed;
  writeFps++;
  if (writeFps == writeFpsCount) {
    fpsLabel.textContent = "fps: " + Math.ceil((writeFps * 1000) / fpsTime);
    writeFps = 0;
    fpsTime = 0;
  }
  let size = 3; // Math.sin((t * 2 * Math.PI) / 10) * 10;
  camera = lookAt(
    new vec3(
      size * Math.sin((t * 2 * Math.PI) / 5),
      size * Math.cos((t * 2 * Math.PI) / 5),
      -4
    ),
    new vec3(0, 0, 0),
    new vec3(0, 1, 0)
  );
  // TODO
  let dt = elapsed / 1000;
  t += dt;

  startRender();

  let updateData = { dt: dt, time: t };
  entities.forEach(r => traverseEntities(r, e => updateEntity(e, updateData)));

  uploadOccluders(entities);

  let renderData = { view: camera };
  entities.forEach(r => traverseEntities(r, e => renderEntity(e, renderData)));

  endRender();

  let timeOut = 1000 / targetFps - (new Date() - startTime);
  if (timeOut < 0) timeOut = 1;

  setTimeout(update, timeOut);
}

function startGame() {
  startTime = new Date();
  // entities = [];
  // t = 0;

  addEntity(
    hackWallCardEntity(new vec3(-1, 1, -1), new vec3(2), new vec3(0, 0, 2))
  );
  addEntity(
    hackWallCardEntity(new vec3(-1, -1, -1), new vec3(0, 2), new vec3(0, 0, 2))
  );
  addEntity(
    hackWallCardEntity(new vec3(1, -1, -1), new vec3(0, 0, 2), new vec3(0, 2))
  );
  addEntity(
    hackWallCardEntity(new vec3(-1, -1, 1), new vec3(0, 2), new vec3(2))
  );
  setTimeout(update, 10);
}

function addEntity(r) {
  traverseEntities(r, e => e.start());
  entities.push(r);
}
