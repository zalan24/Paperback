var scenes = {
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
          action: getAnimateAction()
        }
      ],
      transform: getTranslation(new vec3(0, 0, -0.01)),
      action: getPlayerController("sword")
    },
    {
      id: "testPlatform",
      card: "platform"
      // cardAction: getPlatformController()
    },
    {
      id: "testPlatform2",
      card: "platform",
      stick: false,
      transform: getTranslation(new vec3(0.5, 0, 0)),
      scale: 0.5
      // cardAction: getPlatformController()
    },
    {
      id: "testPlatform3",
      card: "platform",
      stick: true,
      transform: getTranslation(new vec3(0.25, 0, 0)),
      cardTransform: getRotation(new vec3(0, 0, 1), Math.PI / 4),
      scale: 0.3
      // cardAction: getPlatformController()
    },
    {
      id: "testPlatform3",
      card: "platform",
      stick: true,
      transform: getTranslation(new vec3(-0.5, 0, 0)),
      cardTransform: getRotation(new vec3(0, 0, 1), Math.PI / 2),
      scale: 0.3
      // cardAction: getPlatformController()
    },
    {
      id: "testPlatform3",
      card: "platform",
      stick: true,
      translation: [0, -1.5, 0],
      cardTransform: getScaling(new vec3(6, 1, 1)),
      scale: 0.3,
      cardAction: getPlatformController()
    },
    {
      id: "testBackground",
      card: "mountain",
      transform: getTranslation(new vec3(0, 0, 0.5)),
      scale: 0.4,
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
  ]
};
