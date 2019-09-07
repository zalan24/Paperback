// function combineActions(a, b) {
//   if (a == null) return b;
//   if (b == null) return a;
//   return getCompoundAction(a, b);
// }

function loadObject(obj, defaultScale = 0.2, defaultStick = true) {
  let entity = new CardEntity(resources.textures[obj.card].paperTexture);

  let scale = defaultScale;
  if (obj.scale != null) scale = obj.scale;
  if (obj.children != null) {
    for (let i = 0; i < obj.children.length; ++i) {
      entity.addChild(loadObject(obj.children[i], 1, false));
    }
  }
  if (obj.cardAction != null) entity.action = obj.cardAction;
  entity.transform = transformMatMat(
    entity.transform,
    getScaling(new vec3(scale, scale, scale))
  );
  let translation = new vec3();
  if (obj.cardTransform != null)
    entity.transform = transformMatMat(entity.transform, obj.cardTransform);
  if ((obj.stick == null && defaultStick) || (obj.stick && obj.stick != null)) {
    entity = createCardWithStick(entity);
    translation = new vec3(0, -stickHeight);
  }
  if (obj.transform != null) entity.transform = obj.transform;
  if (obj.translation != null) {
    entity.transform = transformMatMat(
      getTranslation(
        new vec3(obj.translation[0], obj.translation[1], obj.translation[2])
      ),
      entity.transform
    );
  }
  entity.transform = transformMatMat(
    getTranslation(translation),
    entity.transform
  );
  if (obj.action != null) entity.action = obj.action;
  entity.id = obj.id;
  return entity;
}

function loadScene(scene) {
  for (let i = 0; i < scene.length; ++i) {
    addEntity(loadObject(scene[i]));
  }
}
