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
  dashScale = 1
) {
  return {
    id: id,
    card: "enemy",
    stick: true,
    children: [
      {
        id: id + "sword",
        card: "sword",
        scale: 0.3,
        translation: [0.3, 0.2, -0.01],
        action: animationAction
      },
      {
        card: "horn",
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
      card: "sun",
      translation: [0.6, 0.75, 0.7],
      stick: true,
      scale: 0.4
    }
  ];
}

function getBossRoom(enemy, level) {
  return [
    getPlayer([0.3, 0.5, 0.5], level),
    enemy,
    getDoorEntity(enemy.id, [-0.8, 0, 0.55]),
    {
      card: "platform",
      translation: [-0.3, 0, 0.55],
      cardTransform: transformMatMat(
        getRotation(new vec3(0, 0, 1), Math.PI / 2),
        getScaling(new vec3(1, 4, 1))
      ),
      action: getPlatformController()
    },
    {
      card: "platform",
      translation: [0.3, 0, 0.55],
      cardTransform: transformMatMat(
        getRotation(new vec3(0, 0, 1), Math.PI / 2),
        getScaling(new vec3(1, 4, 1))
      ),
      action: getPlatformController()
    },
    {
      card: "platform",
      translation: [-0.7, 0.7, 0.55],
      cardTransform: transformMatMat(
        getRotation(new vec3(0, 0, 1), Math.PI / 2),
        getScaling(new vec3(1, 4, 1))
      ),
      action: getPlatformController()
    }
  ].concat(getBackGround());
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

const sceneList = [
  getBossRoom(
    getEnemy("enemy", [0, 0.5, 0.5], 13, 1, 0.1, true, 0.1, true, 1, true, 1),
    13
  )
  // scenes.testScene
];
sceneCount = sceneList.length;
