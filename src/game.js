var entities = [];
var entityIds = {};

function updateEntity(e, updateData) {
  e.update(updateData);
}

function renderEntity(e, renderData) {
  e.render(renderData);
}

var followEntity = null;
var cameraTranslation = new vec3();

// var camera = null; // lookAt(new vec3(2, 3, -5), new vec3(0, 0, 0), new vec3(0, 1, 0));
var camera = lookAt(new vec3(5, 5, 0), new vec3(0, 0, 0), new vec3(0, 1, 0));
var nextCameraPos = null;
var startTime;
var t = 0;

const writeFpsCount = 60;
// CAN_BE_REMOVED
var writeFps = 0;
var fpsTime = 0;
const targetFps = 300;
const maxDt = 0.1;

var graphicsFps = 0;
var graphicsFpsTime = 0;
const minResFps = 24;
const maxResFps = 40;
const minAAFps = 40;
const maxAAFps = 70;
// const minResFps = 220;
// const maxResFps = 250;
// const minAAFps = 250;
// const maxAAFps = 300;
const minCanvasScale = 1 / 8;
const maxAA = 2;
const scaleStep = 0.8;

function getFacing(entity) {
  return transformMatDirection(entity.getTransform(), new vec3(-1)).x;
}

function update() {
  let elapsed = new Date() - startTime;
  startTime = new Date();
  fpsTime += elapsed;
  writeFps++;
  // let size = 1;
  // camera = lookAt(
  //   new vec3(
  //     size * Math.sin((t * 2 * Math.PI) / 10),
  //     size * Math.cos((t * 2 * Math.PI) / 10),
  //     -3
  //   ),
  //   new vec3(0, 0, 0),
  //   new vec3(0, 1, 0)
  // );
  let dt = Math.min(elapsed / 1000, maxDt);
  t += dt;
  graphicsFps++;
  if ((graphicsFpsTime += dt) > 10) {
    let fps = 1 / (graphicsFpsTime / graphicsFps);
    let res = false;
    if (fps < minResFps && canvasSizeScale > minCanvasScale) {
      canvasSizeScale = Math.max(minCanvasScale, canvasSizeScale * scaleStep);
      res = true;
    }
    if (fps > maxResFps && canvasSizeScale < 1) {
      canvasSizeScale = Math.min(1, canvasSizeScale / scaleStep);
      res = true;
    }
    if (fps < minAAFps && antiAliasQuality > 1) {
      antiAliasQuality = Math.max(1, antiAliasQuality * scaleStep);
      res = true;
    }
    if (fps > maxAAFps && antiAliasQuality < maxAA) {
      antiAliasQuality = Math.min(maxAA, antiAliasQuality / scaleStep);
      res = true;
    }
    if (res) {
      // console.log({ canvas: canvasSizeScale, aa: antiAliasQuality });
      resize();
    }
    graphicsFpsTime = 0;
    graphicsFps = 0;
  }
  // TODO test
  // CAN_BE_REMOVED
  if (followEntity == null) {
    nextCameraPos = lookAt(
      new vec3(2, 3, -5),
      new vec3(0, 0, 0),
      new vec3(0, 1, 0)
    );
  } else {
    let ud = 0.5;
    if (
      (followEntity.speed && followEntity.speed.y < -1.5) ||
      followEntity.down
    )
      ud = -0.7;
    else if (followEntity.up) ud = 1;
    let cameraTargetTranslation = new vec3(
      -getFacing(followEntity) * 0.1,
      ud * 0.1
    );
    // cameraTranslation = cameraTargetTranslation;
    cameraTranslation = lerpVec(
      cameraTranslation,
      cameraTargetTranslation,
      1 - Math.pow(2, -dt * 10)
    );
    let pos = addVec(followEntity.getCardPosition(), cameraTranslation);
    let limit = 0.9;
    let camPos = new vec3(
      Math.max(-limit, Math.min(pos.x, limit)),
      Math.max(-limit, Math.min(pos.y, limit)),
      -0.5
    );
    nextCameraPos = lookAt(camPos, pos, new vec3(0, 1, 0));
  }

  let updateData = { dt: dt, time: t };

  entities.forEach(r =>
    traverseEntities(r, e => {
      if (!e.started) e.start();
      e.started = true;
    })
  );
  entities.forEach(r => traverseEntities(r, e => updateEntity(e, updateData)));

  uploadOccluders(entities);

  camera = nextCameraPos;

  startRender();
  let renderData = { view: camera };
  entities.forEach(r => traverseEntities(r, e => renderEntity(e, renderData)));

  endRender();

  let timeOut = Math.max(0, 1000 / targetFps - (new Date() - startTime));

  setTimeout(update, timeOut);
}

function startGame() {
  startTime = new Date();
  entities = [];
  t = 0;

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
  traverseEntities(r, e => {
    if (e.id != null) entityIds[e.id] = e;
  });
  entities.push(r);
}

function clearScene() {
  followEntity = null;
  startGame();
}

function getEntityById(id) {
  return entityIds[id];
}

function broadcastEvent(f) {
  entities.forEach(r => traverseEntities(r, e => f(e)));
}
