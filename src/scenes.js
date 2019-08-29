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
          translation: [1, 0.5, 0]
        }
      ],
      transform: getTranslation(new vec3(0, 0, -0.5))
    },
    {
      id: "testPlatform",
      card: "platform"
    },
    {
      id: "testPlatform2",
      card: "platform",
      stick: false,
      transform: getTranslation(new vec3(0.5, 0, 0)),
      scale: 0.5
    },
    {
      id: "testPlatform3",
      card: "platform",
      stick: true,
      transform: getTranslation(new vec3(-0.5, 0, 0)),
      stransform: getRotation(new vec3(0, 0, 1), Math.PI / 2),
      scale: 0.3
    },
    {
      id: "testBackground",
      card: "mountain",
      transform: getTranslation(new vec3(0, 0, 0.5))
    }
  ]
};
