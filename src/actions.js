const jumpSpeed = 1;
const gravity = new vec3(0, -3, 0);
const dashSpeed = 5;
const dashTime = 0.05;
const handAcceleration = 0.2;
const handDrag = 10;
const handDecceleration = 10;
const handStand = new vec3(0, -1, 0);
const jumps = 1;
const dashes = 1;
const jumpTimeLimit = 0.2;
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
      if (!entity.dashing)
        entity.speed = addVec(
          entity.speed,
          mulVecScalar(gravity, updateData.dt)
        );
      broadcastEvent(e => {
        if (e.collider == null /* || !e.collider */) return;
        let colliderSpeed = new vec3();
        if (e.speed != null) colliderSpeed = e.speed;
        let invMat = invert(e.getTransform());
        // let localPos = transformMatPosition(
        //   invMat,
        //   transformMatPosition(entity.getTransform())
        // );
        let entityToCollider = transformMatMat(invMat, entity.getTransform());
        let entityBox = entity.getBox();
        let transformedBox = [
          transformMatPosition(entityToCollider, entityBox.a),
          transformMatPosition(entityToCollider, entityBox.b),
          transformMatPosition(
            entityToCollider,
            new vec3(entityBox.a.x, entityBox.b.y)
          ),
          transformMatPosition(
            entityToCollider,
            new vec3(entityBox.b.x, entityBox.a.y)
          )
        ];
        let box = { a: transformedBox[0], b: transformedBox[0] };
        // i < transformedBox.length
        for (let i = 1; i < 4; ++i) {
          // CAN_BE_REMOVED
          box.a = minVec2D(box.a, transformedBox[i]);
          box.b = maxVec2D(box.b, transformedBox[i]);
        }
        let entitySpeed = subVec(entity.speed, colliderSpeed);
        let transformedSpeed = transformMatDirection(invMat, entity.speed);
        let speedTranslation = mulVecScalar(transformedSpeed, updateData.dt);
        let translatedBox = {
          a: addVec(box.a, speedTranslation),
          b: addVec(box.b, speedTranslation)
        };
        let collBox = e.getBox();
        let worldUp = transformMatDirection(e.getTransform(), new vec3(0, 1));
        let worldSide = transformMatDirection(e.getTransform(), new vec3(1));
        let translation = new vec3();
        // if (e.parent != null && e.parent.id == "plat")
        //   console.log({ box: box, collBox: collBox });
        if (
          translatedBox.a.y < collBox.b.y &&
          translatedBox.b.y > collBox.a.y
        ) {
          if (translatedBox.a.x <= collBox.b.x && box.b.x > collBox.b.x) {
            translation = new vec3(collBox.b.x - box.a.x);
            entitySpeed = removeComponent(
              entitySpeed,
              mulVecScalar(worldSide, -1)
            );
          }
          if (translatedBox.b.x >= collBox.a.x && box.a.x < collBox.a.x) {
            translation = new vec3(collBox.a.x - box.b.x);
            entitySpeed = removeComponent(entitySpeed, worldSide);
          }
        }

        if (
          translatedBox.a.x < collBox.b.x &&
          translatedBox.b.x > collBox.a.x
        ) {
          if (translatedBox.a.y <= collBox.b.y && box.b.y > collBox.b.y) {
            // on top
            translation = new vec3(0, collBox.b.y - box.a.y);
            entitySpeed = removeComponent(
              entitySpeed,
              mulVecScalar(worldUp, -1)
            );
          }
          if (translatedBox.b.y >= collBox.a.y && box.a.y < collBox.a.y) {
            // below
            translation = new vec3(0, collBox.a.y - box.b.y);
            entitySpeed = removeComponent(entitySpeed, worldUp);
          }
        }
        // console.log(transformMatMat(e.getTransform(), invMat));

        entity.transform = transformMatMat(
          getTranslation(transformMatDirection(e.getTransform(), translation)),
          entity.transform
        );
        entity.speed = addVec(entitySpeed, colliderSpeed);
      });
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
      if (entity.dashing) return;
      let speed = 1;
      let facing = transformMatDirection(entity.getTransform(), new vec3(-1)).x;
      let shouldBeFacing = facing;
      if (entity.left) {
        // entity.transform = transformMatMat(
        //   getTranslation(new vec3(-speed * updateData.dt)),
        //   entity.transform
        // );
        entity.speed.x = -speed;
        shouldBeFacing = 1;
      }
      if (entity.right) {
        // entity.transform = transformMatMat(
        //   getTranslation(new vec3(speed * updateData.dt)),
        //   entity.transform
        // );
        entity.speed.x = speed;
        shouldBeFacing = -1;
      }
      if (entity.stopped) {
        entity.speed.x = 0;
        entity.stopped = false;
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
      entity.stopped = false;
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
        entity.stopped = true;
        if (e.keyCode == 39)
          // right arrow
          entity.right = false;
        entity.stopped = true;
      });
    }
  };
}

function getDashAction() {
  return {
    start: function(entity) {
      entity.dashTime = null;
      entity.dashing = false;
    },
    update: function(entity, updateData) {
      if (
        entity.dashTime != null &&
        updateData.time - entity.dashTime >= dashTime
      ) {
        entity.speed = new vec3();
        entity.dashTime = null;
        entity.dashing = false;
      }
      if (entity.event_dash != null && entity.dashTime == null) {
        entity.dashTime = updateData.time;
        let dir = new vec3(Math.sign(entity.event_dash.dir.x), 0, 0);
        entity.dashSpeed = mulVecScalar(dir, dashSpeed);
        entity.speed = entity.dashSpeed;
        entity.event_dash = null;
        entity.dashing = true;
      }
    }
  };
}

function getStickAction() {
  return {
    start: function(entity) {
      if (!entity.isStick) return;
      entity.lastStickPos = transformMatPosition(entity.transform);
      entity.handSpeed = new vec3();
      entity.lastCardPos = entity.getCardPosition();
    },
    update: function(entity, updateData) {
      if (!entity.isStick) return;
      let currentPos = transformMatPosition(entity.transform);
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
      let diff = subVec(currentPos, expectedPos);
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
        let rot = getRotation(axis, -angle);
        let transform = transformMatMat(
          getTranslation(cardPos),
          transformMatMat(rot, getTranslation(mulVecScalar(cardPos, -1)))
        );
        entity.transform = transformMatMat(transform, entity.transform);
      }

      currentPos = transformMatPosition(entity.transform);
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
  return getCompoundAction([dash, move, stickAction, keyBoard, phys]);
}

function getColliderAction() {
  return {
    start: function(entity) {
      entity.collider = true;
    }
    // ,
    // update: function(entity, updateData) {}
  };
}

function getMovePlatformAction(to, duration) {
  return {
    start: function(entity) {
      entity.speed = new vec3();
      entity.moveState = 0;
      entity.startPos = entity.transform.col3;
    },
    update: function(entity, updateData) {
      entity.moveState += updateData.dt;
      let t = Math.sin((entity.moveState * 2 * Math.PI) / duration) / 2 + 0.5;
      entity.transform.col3 = addVec(entity.startPos, mulVecScalar(to, t));
      entity.speed = mulVecScalar(
        to,
        (Math.cos((entity.moveState * 2 * Math.PI) / duration) * Math.PI) /
          duration
      );
    }
  };
}

function getPlatformController(moveData = { to: new vec3(), duration: 1 }) {
  let collider = getColliderAction();
  let movePlatformAction = getMovePlatformAction(
    moveData.to,
    moveData.duration
  );
  let stickAction = getStickAction();
  return getCompoundAction([collider, movePlatformAction]);
}
