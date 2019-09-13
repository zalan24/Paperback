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
  chargeScale = 1,
  moveScale = 1,
  canHit = true,
  hitScale = 1,
  canJump = false,
  jumpScale = 1,
  canDash = false,
  dashScale = 1,
  card = "enemy",
  horn = "horn",
  sword = "sword"
) {
  return {
    id: id,
    card: card,
    stick: true,
    children: [
      {
        id: id + "sword",
        card: sword,
        scale: 0.3,
        translation: [0.3, 0.2, -0.01],
        action: animationAction
      },
      {
        card: horn,
        scale: 0.5,
        translation: [0, 0.4, 0.01]
      }
    ],
    translation: pos,
    scale: 0.15 + lives * 0.01,
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

function getBackGround() {
  return [
    {
      card: "mountain",
      translation: [0.3, 0.2, 0.75],
      stick: true,
      scale: 0.5
    },
    {
      card: "mountain",
      translation: [0.13, 0.4, 0.8],
      stick: true,
      scale: 0.3
    },
    {
      card: "mountain",
      translation: [-0.7, 0.3, 0.85],
      stick: true,
      scale: 0.5
    },
    {
      card: "tree",
      translation: [-0.3, 0.15, 0.65],
      stick: true,
      scale: 0.4
    },
    {
      card: "tree",
      translation: [0.5, 0.05, 0.6],
      stick: true,
      scale: 0.4
    },
    {
      card: "cloud",
      translation: [-0.1, 0.8, 0.6],
      scale: 0.4,
      cardTransform: getRotation(new vec3(0, 0, 1), -Math.PI / 2)
    },
    {
      card: "sun",
      translation: [0.6, 0.75, 0.7],
      stick: true,
      scale: 0.4
    }
  ];
}

const interior = [
  {
    card: "platform",
    translation: [-0.35, 0, 0.55],
    cardTransform: transformMatMat(
      getRotation(new vec3(0, 0, 1), -Math.PI / 2),
      getScaling(new vec3(1, 4, 1))
    ),
    action: getPlatformController()
  },
  {
    card: "platform",
    translation: [-0.8, 0, 0.55],
    cardTransform: transformMatMat(
      getRotation(new vec3(0, 0, 1), -Math.PI / 2),
      getScaling(new vec3(1, 1, 1))
    ),
    action: getPlatformController()
  },
  {
    card: "platform",
    translation: [0.35, 0, 0.55],
    cardTransform: transformMatMat(
      getRotation(new vec3(0, 0, 1), -Math.PI / 2),
      getScaling(new vec3(1, 4, 1))
    ),
    action: getPlatformController()
  },
  {
    card: "platform",
    translation: [-0.5, 0.75, 0.55],
    cardTransform: transformMatMat(
      getRotation(new vec3(0, 0, 1), -Math.PI / 4),
      getScaling(new vec3(1, 4, 1))
    ),
    action: getPlatformController()
  },
  {
    card: "platform",
    translation: [-0.7, 0.4, 0.55],
    cardTransform: getScaling(new vec3(1, 2, 1)),
    action: getPlatformController()
  }
].concat(getBackGround());

const startRoom = [
  getPlayer([0, 0.55, 0.55], 13),
  {
    card: "stand",
    translation: [0, 0.15, 0.55],
    cardTransform: getScaling(new vec3(2, 1, 1)),
    action: getPlatformController()
  },
  {
    card: "stand",
    translation: [-0.1, 0.12, 0.55],
    cardTransform: getScaling(new vec3(2, 0.7, 1)),
    action: getPlatformController()
  },
  {
    card: "stand",
    translation: [0.1, 0.09, 0.55],
    cardTransform: getScaling(new vec3(2, 0.3, 1)),
    action: getPlatformController()
  },
  getEnemy(
    "princess",
    [0.5, 0.1, 0.55],
    1,
    1,
    0,
    false,
    1,
    false,
    1,
    false,
    1,
    "princess",
    "sun",
    "heart"
  )
].concat(interior);

function getBossRoom(enemy, level) {
  return [
    getPlayer([0.7, 0.55, 0.55], level),
    enemy,
    getDoorEntity(enemy.id, [-0.7, 0.1, 0.55]),
    {
      card: "checkpoint",
      translation: [0.7, 0.5, 0.55],
      cardTransform: transformMatMat(
        getRotation(new vec3(0, 0, 1), -Math.PI / 2),
        getScaling(new vec3(1, 1, 1))
      ),
      action: getPlatformController(false, true)
    },
    {
      card: "platform",
      translation: [0, 0.5, 0.55],
      cardTransform: transformMatMat(
        getRotation(new vec3(0, 0, 1), -Math.PI / 2),
        getScaling(new vec3(1, 4, 1))
      ),
      action: getPlatformController()
    }
  ].concat(interior);
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

const enemyPos = [-0.4, 0.1, 0.5];

const sceneList = [
  getBossRoom(
    getEnemy("enemy", enemyPos, 12, 1, 0.1, true, 0.1, true, 1, true, 1),
    12
  ),
  getBossRoom(
    getEnemy("enemy", enemyPos, 13, 1, 0.1, true, 0.1, true, 1, true, 1),
    13
  ),
  startRoom
  // scenes.testScene
];
sceneCount = sceneList.length;
