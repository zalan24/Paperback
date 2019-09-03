const jumpSpeed = 1;
const gravity = new vec3(0, 0, 0);
const dashSpeed = 5;
const dashTime = 0.05;

function invlerp(v, a, b) {
  return Math.max(0, Math.min(1, (v - a) / (b - a)));
}

function getTranslationAnimation(from, to, timeStart, timeEnd) {
  return function(t) {
    return getTranslation(lerpVec(from, to, invlerp(t, timeStart, timeEnd)));
  };
}

function getScaleAnimation(from, to, timeStart, timeEnd) {
  return function(t) {
    return getScaling(lerpVec(from, to, invlerp(t, timeStart, timeEnd)));
  };
}

function getScaleAnimation(axis, from, to, timeStart, timeEnd) {
  return function(t) {
    return getRotation(
      axis,
      (to - from) * invlerp(t, timeStart, timeEnd) + from
    );
  };
}

function getAnimationTransform(animation, t) {
  let ret = new mat3x4();
  for (let i = 0; i < animation.transitions.length; ++i)
    ret = transformMatMat(ret, animation.transitions[i](t));
  return ret;
}

const animations = {
  hit: {
    duration: 0.5,
    transitions: [
      getTranslationAnimation(new vec3(), new vec3(1, 0, 0), 0, 0.25),
      getTranslationAnimation(new vec3(), new vec3(-1, 0, 0), 0.25, 0.5)
    ]
  }
};

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

function getAnimateAction() {
  return {
    start: function(entity) {
      entity.animation = null;
      entity.animationLeft = 0;
      entity.animationBaseTransform = entity.transform;
    },
    update: function(entity, updateData) {
      if (entity.animation == null) return;
      if (entity.animationLeft <= 0) {
        entity.animation = null;
        entity.transform = entity.animationBaseTransform;
      } else {
        let transform = getAnimationTransform(
          entity.animation,
          entity.animation.duration - entity.animationLeft
        );
        entity.transform = transformMatMat(
          transform,
          entity.animationBaseTransform
        );
        entity.animationLeft -= updateData.dt;
      }
    }
  };
}

function addAnimation(entity, anim) {
  entity.animation = anim;
  entity.animationLeft = anim.duration;
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

function getMoveAction() {
  return {
    update: function(entity, updateData) {
      let speed = 1;
      let facing = transformMatDirection(entity.getTransform(), new vec3(-1)).x;
      let shouldBeFacing = facing;
      if (entity.left) {
        entity.transform = transformMatMat(
          getTranslation(new vec3(-speed * updateData.dt)),
          entity.transform
        );
        shouldBeFacing = 1;
      }
      if (entity.right) {
        entity.transform = transformMatMat(
          getTranslation(new vec3(speed * updateData.dt)),
          entity.transform
        );
        shouldBeFacing = -1;
      }
      if (facing * shouldBeFacing < 0) {
        let mirror = new mat3x4();
        mirror.col0 = mulVecScalar(mirror.col0, -1);
        entity.transform = transformMatMat(entity.transform, mirror);
      }
    },
    start: function(entity) {
      entity.left = false;
      entity.right = false;
    }
  };
}

function getKeyboardController(weaponId) {
  return {
    start: function(entity) {
      document.addEventListener("keydown", e => {
        e = e || window.event;
        if (e.keyCode == 37) {
          // left arrow
          entity.left = true;
          entity.right = false;
        }
        if (e.keyCode == 39) {
          // right arrow
          entity.right = true;
          entity.left = false;
        }
        if (e.keyCode == 90)
          entity.speed = new vec3(entity.speed.x, jumpSpeed, entity.speed.z);
        if (e.keyCode == 88)
          addAnimation(getEntityById(weaponId), animations.hit);
        // console.log("key: " + e.keyCode);
        if (e.keyCode == 67) {
          entity.event_dash = {
            dir: normalize(
              transformMatDirection(entity.getTransform(), new vec3(1))
            )
          };
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
  return {
    start: function(entity) {
      entity.dashTime = null;
    },
    update: function(entity, updateData) {
      if (
        entity.dashTime != null &&
        updateData.time - entity.dashTime >= dashTime
      ) {
        entity.speed = new vec3();
        entity.dashTime = null;
      }
      if (entity.event_dash != null && entity.dashTime == null) {
        entity.dashTime = updateData.time;
        entity.dashSpeed = mulVecScalar(entity.event_dash.dir, dashSpeed);
        entity.speed = entity.dashSpeed;
        entity.event_dash = null;
      }
    }
  };
}

function getPlayerController(weaponId) {
  let phys = getPhysicsController();
  let dash = getDashAction();
  let move = getMoveAction();
  let keyBoard = getKeyboardController(weaponId);
  return getCompoundAction([dash, phys, move, keyBoard]);
}
