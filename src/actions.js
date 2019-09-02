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
      // TODO
    }
  };
}

function getKeyboardController(physAction) {
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
        if (e.keyCode == "37")
          // left arrow
          entity.left = true;
        else if (e.keyCode == "39")
          // right arrow
          entity.right = true;
      });

      document.addEventListener("keyup", e => {
        e = e || window.event;
        if (e.keyCode == "37")
          // left arrow
          entity.left = false;
        else if (e.keyCode == "39")
          // right arrow
          entity.right = false;
      });
    }
  };
}

function getPlayerController() {
  let phys = getPhysicsController();
  let keyBoard = getKeyboardController(phys);
  return getCompoundAction([keyBoard, phys]);
}
