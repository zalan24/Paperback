const jumpSpeed = 0.1;
const gravity = new vec3(0, 0, 0);
const dashSpeed = 5;
const dashTime = 0.05;
const handAcceleration = 0.2;
const handDrag = 10;
const handDecceleration = 10;
const handStand = new vec3(0, -1, 0);
const jumps = 1;
const dashes = 1;
const jumpTimeLimit = 0.5;
const dashTimeLimit = 0.5;
const hitTimeLimit = 0.3;

function invlerp(v, a, b) {
  return Math.max(0, Math.min(1, (v - a) / (b - a)));
}

function getTranslationAnimation(to, timeStart, timeEnd, from = new vec3()) {
  return function(t) {
    return getTranslation(lerpVec(from, to, invlerp(t, timeStart, timeEnd)));
  };
}

function getScaleAnimation(to, timeStart, timeEnd, from = new vec3(1, 1, 1)) {
  return function(t) {
    return getScaling(lerpVec(from, to, invlerp(t, timeStart, timeEnd)));
  };
}

function getRotationAnimation(axis, to, timeStart, timeEnd, from = 0) {
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
      getTranslationAnimation(new vec3(1, 0, 0), 0, 0.25),
      getTranslationAnimation(new vec3(-1, 0, 0), 0.25, 0.5)
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

function canJump(entity) {
  if (entity.grounded) entity.jumpLeft = jumps;
  return entity.jumpLeft > 0 && entity.jumpTime + jumpTimeLimit < entity.time;
}
function jump(entity) {
  if (canJump(entity)) {
    entity.speed = new vec3(entity.speed.x, jumpSpeed, entity.speed.z);
    if (!entity.grounded) entity.jumpLeft--;
    entity.jumpTime = entity.time;
  }
}

function canDash(entity) {
  if (entity.grounded) entity.dashLeft = dashes;
  return entity.dashLeft > 0 && entity.dashTimem + dashTimeLimit < entity.time;
}
function dash(entity) {
  if (canDash(entity)) {
    entity.event_dash = {
      dir: normalize(transformMatDirection(entity.getTransform(), new vec3(1)))
    };
    if (!entity.grounded) entity.dashLeft--;
    entity.dashTimem = entity.time;
  }
}

function canHit(entity) {
  return entity.hitTime + hitTimeLimit < entity.time;
}
function hit(entity, weapon, animation) {
  if (canHit(entity)) {
    addAnimation(getEntityById(weapon), animation);
    entity.hitTime = entity.time;
  }
}

function getPhysicsController() {
  return {
    start: function(entity) {
      entity.speed = new vec3();
      entity.grounded = true;
      entity.jumpLeft = jumps;
      entity.jumpTime = 0;
      entity.dashLeft = dashes;
      entity.dashTimem = 0;
      entity.time = 0;
      entity.hitTime = 0;
    },
    update: function(entity, updateData) {
      entity.speed = addVec(entity.speed, mulVecScalar(gravity, updateData.dt));
      // TODO collision
      entity.transform = transformMatMat(
        getTranslation(mulVecScalar(entity.speed, updateData.dt)),
        entity.transform
      );
      entity.time = updateData.time;
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
        if (e.keyCode == 90) jump(entity);
        if (e.keyCode == 88) hit(entity, weaponId, animations.hit);
        // console.log("key: " + e.keyCode);
        if (e.keyCode == 67) dash(entity);
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
        let dir = new vec3(Math.sign(entity.event_dash.dir.x), 0, 0);
        entity.dashSpeed = mulVecScalar(dir, dashSpeed);
        entity.speed = entity.dashSpeed;
        entity.event_dash = null;
      }
    }
  };
}

function getStickAction() {
  return {
    start: function(entity) {
      entity.lastStickPos = transformMatPosition(entity.transform, new vec3());
      entity.handSpeed = new vec3();
      entity.lastCardPos = entity.getCardPosition();
    },
    update: function(entity, updateData) {
      let currentPos = transformMatPosition(entity.transform, new vec3());
      let cardPos = entity.getCardPosition();
      let cardSpeed = mulVecScalar(
        subVec(cardPos, entity.lastCardPos),
        1 / updateData.dt
      );
      let handSpeedLen = lengthVec(entity.handSpeed);
      if (handSpeedLen > 0)
        entity.handSpeed = mulVecScalar(
          normalize(entity.handSpeed),
          Math.max(
            handSpeedLen -
              handSpeedLen * handSpeedLen * handDrag * updateData.dt,
            0
          )
        );
      let speedDiff = subVec(entity.handSpeed, cardSpeed);
      handSpeedLen = lengthVec(speedDiff);
      if (handSpeedLen > 0)
        speedDiff = mulVecScalar(
          normalize(speedDiff),
          Math.max(handSpeedLen - handDecceleration * updateData.dt, 0)
        );
      entity.handSpeed = addVec(cardSpeed, speedDiff);
      let expectedPos = addVec(
        mulVecScalar(handStand, updateData.dt),
        addVec(
          entity.lastStickPos,
          mulVecScalar(entity.handSpeed, updateData.dt)
        )
      );
      // let expectedPos = entity.lastStickPos;
      let diff = subVec(currentPos, expectedPos);
      // if (lengthVec(diff) > 0) {
      let up = normalize(subVec(currentPos, cardPos));
      let moveDiff = mulVecScalar(up, dot(up, diff));
      let acc =
        lengthVec(moveDiff) > 0
          ? mulVecScalar(
              normalize(moveDiff),
              Math.min(lengthVec(moveDiff), handAcceleration * updateData.dt)
            )
          : new vec3();
      let preferredPosition = addVec(expectedPos, acc);

      let dir = normalize(subVec(preferredPosition, cardPos));
      let axis = cross(dir, up);
      if (lengthVec(axis) > 0) {
        let angle = Math.asin(lengthVec(axis));
        axis = normalize(axis);
        // let side = cross(up, axis);
        // let angle = Math.atan2(dot(side, dir), dot(up, dir));
        let rot = getRotation(axis, -angle);
        // let rot = getRotation(
        //   new vec3(0, 0, 1),
        //   (updateData.dt * 2 * Math.PI) / 2
        // );
        let transform = transformMatMat(
          getTranslation(cardPos),
          transformMatMat(rot, getTranslation(mulVecScalar(cardPos, -1)))
        );
        entity.transform = transformMatMat(transform, entity.transform);
      }
      // }

      currentPos = transformMatPosition(entity.transform, new vec3());
      entity.handSpeed = mulVecScalar(
        subVec(currentPos, entity.lastStickPos),
        1 / updateData.dt
      );
      entity.lastStickPos = currentPos;
      entity.lastCardPos = entity.getCardPosition();
    }
  };
}

function getPlayerController(weaponId) {
  let phys = getPhysicsController();
  let dash = getDashAction();
  let move = getMoveAction();
  let stickAction = getStickAction();
  let keyBoard = getKeyboardController(weaponId);
  return getCompoundAction([dash, phys, move, stickAction, keyBoard]);
}
