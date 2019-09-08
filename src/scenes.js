const scenes = {
  testScene: [
    {
      id: "player",
      card: "character",
      children: [
        {
          id: "sword",
          card: "sword",
          scale: 0.3,
          translation: [0.3, 0.2, 0],
          action: animationAction
        }
      ],
      translation: [0, -0.5, -0.01],
      action: getPlayerController("sword")
    },
    // {
    //   id: "testPlatform",
    //   card: "platform",
    //   action: getPlatformController()
    // },
    {
      id: "testPlatform2",
      card: "platform",
      stick: false,
      translation: [0.7, -0.5, 0],
      cardTransform: getScaling(new vec3(1, 0.1, 1)),
      scale: 0.5,
      action: getPlatformController(false, {
        to: new vec3(0, 0.5),
        duration: 5
      })
    },
    {
      card: "platform",
      // stick: false,
      translation: [0.7, 0, 0],
      cardTransform: getScaling(new vec3(1, 0.1, 1)),
      scale: 0.5,
      action: getPlatformController(false, { to: new vec3(-1), duration: 2 })
    },
    {
      card: "platform",
      id: "plat",
      translation: [-0.3, -0.4, 0],
      cardTransform: getScaling(new vec3(1, 3, 1)),
      scale: 0.5,
      // action: getPlatformController({ to: new vec3(-1), duration: 5 })
      action: getPlatformController()
    },
    {
      id: "testPlatform3",
      card: "platform",
      stick: true,
      transform: getTranslation(new vec3(0.25, 0.7, 0)),
      cardTransform: getRotation(new vec3(0, 0, 1), Math.PI / 4),
      scale: 0.3,
      action: getPlatformController()
    },
    {
      card: "platform",
      stick: true,
      transform: getTranslation(new vec3(-0.5, 0.5, 0)),
      cardTransform: getRotation(new vec3(0, 0, 1), Math.PI / 2),
      scale: 0.3,
      action: getPlatformController()
    },
    {
      card: "platform",
      stick: false,
      translation: [0.3, -0.8, 0],
      cardTransform: getScaling(new vec3(7, 1, 1)),
      scale: 0.3,
      action: getPlatformController()
    },
    {
      card: "platform",
      stick: false,
      translation: [-0.9, -0.2, 0],
      cardTransform: transformMatMat(
        getRotation(new vec3(0, 0, 1), -Math.PI / 2),
        getScaling(new vec3(6, 1, 1))
      ),
      scale: 0.3,
      action: getPlatformController()
    },
    {
      card: "platform",
      stick: false,
      translation: [0.9, -0.2, 0],
      cardTransform: transformMatMat(
        getRotation(new vec3(0, 0, 1), -Math.PI / 2),
        getScaling(new vec3(6, 1, 1))
      ),
      scale: 0.3,
      action: getPlatformController()
    },
    {
      id: "testBackground",
      card: "mountain",
      transform: transformMatMat(
        getTranslation(new vec3(0, 2, 0.5)),
        getScaling(new vec3(0.4, 0.4, 0.4))
      ),
      scale: 1,
      action: getRotationAction(0.2)
    }
    // {
    //   id: "testBackground",
    //   card: "mountain",
    //   // cardTransform: getRotation(new vec3(0, 1, 0), Math.PI / 2),
    //   scale: 1,
    //   // translation: [1, -2, -0.5]
    //   translation: [0, -2, -0.5]
    // }
  ],
  bladeScene: [
    {
      id: "player",
      card: "character",
      children: [
        {
          id: "sword",
          card: "sword",
          scale: 0.3,
          translation: [0.3, 0.2, 0],
          action: animationAction
        }
      ],
      translation: [0, -0.5, -0.01],
      action: getPlayerController("sword")
    },
    {
      card: "platform",
      stick: false,
      translation: [0.3, -0.8, 0],
      cardTransform: getScaling(new vec3(7, 1, 1)),
      scale: 0.3,
      action: getPlatformController()
    },
    {
      card: "platform",
      // stick: false,
      translation: [-0.7, -1, 0],
      cardTransform: getScaling(new vec3(1, 0.5, 1)),
      scale: 0.5,
      action: getPlatformController(true, { to: new vec3(0, 0.1), duration: 2 })
    },
    {
      card: "platform",
      // stick: false,
      translation: [0, 0, 0],
      cardTransform: getScaling(new vec3(0.5, 0.5, 0.5)),
      cardAction: getRotationAction(1),
      scale: 0.5,
      action: getPlatformController(true, { to: new vec3(0, 0.1), duration: 2 })
    }
  ]
};

const sceneList = [scenes.bladeScene, scenes.testScene];
sceneCount = sceneList.length;
