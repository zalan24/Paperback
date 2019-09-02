const jumpSpeed = 1;
const gravity = new vec3(0, 0, 0);
const dashSpeed = 10;
const dashTime = 0.1;

// TODO remove
function getRotationAction(speed) {
  return {
    start: function(entity) {},
    update: function(entity, updateData) {
      entity.transform = transformMatMat(
        entity.transform,
        getRotation(new vec3(0, 0, 1), updateData.dt * 2 * Math.PI * speed)
      );
    }
  };
}

function getCompoundAction(actions) {
  return {
    start: function(entity) {
      for (let i = 0; i < actions.length; ++i)
        if (actions[i].start != null) actions[i].start(entity);
    },
    update: function(entity, updateData) {
      for (let i = 0; i < actions.length; ++i)
        if (actions[i].update != null) actions[i].update(entity, updateData);
    }
  };
}

function getPhysicsController() {
  return {
    start: function(entity) {
      entity.speed = new vec3();
    },
    update: function(entity, updateData) {
      entity.speed = addVec(entity.speed, mulVecScalar(gravity, updateData.dt));
      // TODO collision
      entity.transform = transformMatMat(
        getTranslation(mulVecScalar(entity.speed, updateData.dt)),
        entity.transform
      );
    }
  };
}

function getKeyboardController() {
  return {
    update: function(entity, updateData) {
      let speed = 1;
      if (entity.left)
        entity.transform = transformMatMat(
          getTranslation(new vec3(-speed * updateData.dt)),
          entity.transform
        );
      if (entity.right)
        entity.transform = transformMatMat(
          getTranslation(new vec3(speed * updateData.dt)),
          entity.transform
        );
    },
    start: function(entity) {
      entity.left = false;
      entity.right = false;
      document.addEventListener("keydown", e => {
        e = e || window.event;
        if (e.keyCode == 37)
          // left arrow
          entity.left = true;
        if (e.keyCode == 39)
          // right arrow
          entity.right = true;
        if (e.keyCode == 32)
          entity.speed = new vec3(entity.speed.x, jumpSpeed, entity.speed.z);
        // console.log("key: " + e.keyCode);
        if (e.keyCode == 67) {
          // TODO
          // entity.event_dash(entity, updateData, {
          //   dir: normalize(
          //     transformMatDirection(entity.getTransform(), new vec3(1))
          //   )
          // });
        }
      });

      document.addEventListener("keyup", e => {
        e = e || window.event;
        if (e.keyCode == 37)
          // left arrow
          entity.left = false;
        if (e.keyCode == 39)
          // right arrow
          entity.right = false;
      });
    }
  };
}

function getDashAction() {
  // TODO
  return {
    start: function(entity) {
      entity.dashTime = null;
    },
    update: function(entity, updateData) {
      if (entity.dashTime == null) return;
      if (updateData.time - entity.dashTime >= dashTime) {
        entity.speed = subVec(entity.speed, entity.dashSpeed);
        entity.dashTime = null;
      }
    },
    event: function(entity, updateData, dashData) {
      if (entity.dashTime != null) return;
      entity.dashTime = updateData.time;
      entity.dashSpeed = mulVecScalar(dashSpeed, dashData.dir);
      entity.speed = addVec(entity.speed, entity.dashSpeed);
    }
  };
}

function getPlayerController() {
  let phys = getPhysicsController();
  let dash = getDashAction();
  let keyBoard = getKeyboardController(phys, dash);
  return getCompoundAction([dash, phys, keyBoard]);
}
