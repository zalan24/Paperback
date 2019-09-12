function getPlayer(pos, scenei) {
  return {
    id: "player",
    card: "character",
    stick: true,
    children: [
      {
        id: "sword",
        card: "sword",
        scale: 0.3 + scenei * 0.03,
        translation: [0.3, 0.2, -0.01],
        action: animationAction
      }
    ],
    scale: 0.15,
    translation: pos,
    action: getPlayerController("sword", scenei)
  };
}

function getEnemy(
  id,
  pos,
  lives,
  card,
  weaponCard,
  chargeScale = 1,
  moveScale = 1,
  canHit = true,
  hitScale = 1,
  canJump = false,
  jumpScale = 1,
  canDash = false,
  dashScale = 1
) {
  return {
    id: id,
    card: card,
    stick: true,
    children: [
      {
        id: id + "sword",
        card: weaponCard,
        scale: 0.3,
        translation: [0.3, 0.2, 0],
        action: animationAction
      }
    ],
    translation: pos,
    scale: 0.15,
    action: getEnemyController(
      lives,
      id + "sword",
      chargeScale,
      moveScale,
      canHit,
      hitScale,
      canJump,
      jumpScale,
      canDash,
      dashScale
    )
  };
}

function getDoorEntity(enemyId, pos) {
  return {
    card: "door",
    translation: pos,
    action: getDoorAction(enemyId)
  };
}

function getBossRoom(enemy, level) {
  return [
    getPlayer([0.3, 0.5, 0.5], level),
    enemy,
    getDoorEntity(enemy.id, [-0.8, 0, 0.55]),
    {
      card: "platform",
      translation: [-0.3, 0, 0.55],
      // cardTransform: getScaling(new vec3(4, 1, 1)),
      action: getPlatformController()
    },
    {
      card: "platform",
      translation: [0.3, 0, 0.55],
      // cardTransform: getScaling(new vec3(4, 1, 1)),
      action: getPlatformController()
    },
    {
      card: "platform",
      translation: [-0.7, 0.7, 0.55],
      cardTransform: transformMatMat(
        getRotation(new vec3(0, 0, 1), Math.PI / 2),
        getScaling(new vec3(4, 1, 1))
      ),
      action: getPlatformController()
    }
  ];
}

function createHeartEntity(i) {
  return {
    card: "heart",
    scale: 0.3,
    stick: true,
    transform: getScaling(new vec3(0.02, 0.02, 0.02)),
    action: getHeartAction("player", i)
  };
}

const maxHeartNum = 10;
var hearts = [];
for (let i = 0; i < maxHeartNum; ++i) hearts.push(createHeartEntity(i));

const scenes = {
  testScene: [
    getPlayer([0, -0.5, -0.01], 1),
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
      action: getPlatformController(false, false, {
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
      action: getPlatformController(false, false, {
        to: new vec3(-1),
        duration: 2
      })
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
      action: getPlatformController(true)
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
    getPlayer([0.3, 0.5, -0.01], 0),
    getEnemy(
      "enemy",
      [-0.7, 0, 0],
      3,
      "character",
      "sword",
      1,
      1,
      true,
      1,
      false,
      1,
      false,
      1
    ),
    getDoorEntity("enemy", [-0.8, -0.2, 0]),
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
      action: getPlatformController(true, false, {
        to: new vec3(0, 0.1),
        duration: 2
      })
    },
    {
      card: "platform",
      // stick: false,
      translation: [-0.7, -0.7, 0],
      cardTransform: getScaling(new vec3(1, 0.5, 1)),
      scale: 0.5,
      action: getPlatformController(false, false, {
        to: new vec3(0.2, 0),
        duration: 2
      })
    },
    {
      card: "platform",
      // stick: false,
      translation: [0.7, -0.7, 0],
      cardTransform: getScaling(new vec3(1, 0.5, 1)),
      scale: 0.5,
      action: getPlatformController(false, false, {
        to: new vec3(-0.2, 0),
        duration: 2
      })
    },
    {
      card: "platform",
      // stick: false,
      translation: [0.5, 0, 0],
      cardTransform: getScaling(new vec3(1, 0.5, 1)),
      scale: 0.5,
      action: getPlatformController(false, true)
    },
    {
      card: "platform",
      // stick: false,
      translation: [0, 0, 0],
      cardTransform: getScaling(new vec3(0.5, 0.5, 0.5)),
      cardAction: getRotationAction(1),
      scale: 0.5,
      action: getPlatformController(true, false, {
        to: new vec3(0, 0.1),
        duration: 2
      })
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
    }
  ]
};

const sceneList = [
  scenes.bladeScene,
  getBossRoom(
    getEnemy(
      "enemy",
      [0, 0.5, 0.5],
      3,
      "character",
      "sword",
      1,
      1,
      true,
      1,
      true,
      1,
      true,
      1
    ),
    13
  )
  // scenes.testScene
];
sceneCount = sceneList.length;
