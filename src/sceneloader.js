function loadObject(obj, defaultScale = 0.2, defaultStick = true) {
  let entity = new CardEntity(resources.textures[obj.card].paperTexture);

  let scale = defaultScale;
  if (obj.scale != null) scale = obj.scale;
  if (obj.children != null) {
    for (let i = 0; i < obj.children.length; ++i) {
      entity.addChild(loadObject(obj.children[i], 1, false));
    }
  }
  if ((obj.stick == null && defaultStick) || (obj.stick && obj.stick != null)) {
    let stick = createCardWithStick(entity);
    if (obj.stransform != null)
      entity.transform = transformMatMat(entity.transform, obj.stransform);
    entity = stick;
  }
  if (obj.transform != null) entity.transform = obj.transform;
  entity.transform = transformMatMat(
    entity.transform,
    getScaling(new vec3(scale, scale, scale))
  );
  if (obj.translation != null) {
    entity.transform = transformMatMat(
      entity.transform,
      getTranslation(
        new vec3(obj.translation[0], obj.translation[1], obj.translation[2])
      )
    );
  }
  if (obj.action != null) entity.action = obj.action;
  entity.id = obj.id;
  return entity;
}

function loadScene(scene) {
  for (let i = 0; i < scene.length; ++i) {
    addEntity(loadObject(scene[i]));
  }
}
