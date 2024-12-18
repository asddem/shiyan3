const imagesToLoad = [
  'images/1.jpg',
  'images/6.jpg',
  'images/2.jpg',
  'images/5.jpg',
  'images/3.jpg',
  'images/4.jpg',
  'images/7.jpg'
];
const loadedImages = [];

function preloadImages() {
  return new Promise((resolve) => {
    let loadedCount = 0;
    imagesToLoad.forEach((imageUrl) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        loadedImages.push(img);
        if (loadedCount === imagesToLoad.length) {
          resolve();
        }
      };
      img.src = imageUrl;
    });
  });
}

async function loadElementData(element) {

    const response = await fetch(`${element}`);
    const data=await response.text();
    return data;
}


// 模拟宝藏地图API
class TreasureMap {
  static getInitialClue() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("在古老的图书馆里找到了第一个线索...");
      }, 1000);
    });
  }

  static decodeAncientScript(clue) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!clue) {
          reject("没有线索可以解码!");
        }
        resolve("解码成功!宝藏在一座古老的神庙中...");
      }, 1500);
    });
  }

  static searchTemple(location) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const random = Math.random();
        if (random < 0.5) {
          reject("糟糕!遇到了神庙守卫!");
        }
        resolve("找到了一个神秘的箱子...");
      }, 2000);
    });
  }

  static openTreasureBox() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("恭喜!你找到了传说中的宝藏!");
      }, 1000);
    });
  }

  static encounterMagicMaze() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("遇到神庙守卫，需要马上逃跑...");
      }, 1200);
    });
  }

  static exitMagicMaze() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("成功逃跑！进入大殿...");
      }, 1000);
    });
  }
};

const processImage = document.getElementById('process-image');

const processText=document.getElementById('image-description');

// 检查本地存储中是否有玩家信息，如果没有则初始化一个空对象
let playerInfo = JSON.parse(localStorage.getItem('playerInfo')) || {
  playerID: '',
  nickname: '',
  gameHistory: []
};

async function findTreasureWithAsyncAwait() {
  try {
      // 标记游戏是否失败，初始化为false
      let gameFailed = false;
        // 加载背景音乐
      const audio = new Audio('background_music.mp3');
      audio.loop = true;
      audio.play();
      await preloadImages();
      document.getElementById('game-message').textContent = '寻宝进度：寻找第一个线索...';
      processImage.src = 'images/1.jpg';
      document.getElementById('image-description').textContent = '始建于公元前 259 年，由托勒密一世创建，位于埃及亚历山大，是世界上最古老的图书馆之一,在托勒密二世、托勒密三世时期达到鼎盛';
      setTimeout(() => {
        document.getElementById('image-description').style.display = 'none';
      }, 1000);
      const clue = await TreasureMap.getInitialClue();
      console.log(clue);
      document.getElementById('game-message').textContent = "寻宝进度：解码线索...";
      processImage.src = 'images/6.jpg';
      const location = await TreasureMap.decodeAncientScript(clue);
      console.log(location);
      document.getElementById('game-message').textContent = "寻宝进度：前往神庙...";
      processImage.src = 'images/2.jpg';
      const box = await TreasureMap.searchTemple(location);
      console.log(box);
      document.getElementById('game-message').textContent = "寻宝进度：遇到神庙守卫...";
      processImage.src = 'images/5.jpg';
      const mazeMessage = await TreasureMap.encounterMagicMaze();
      console.log(mazeMessage);
      document.getElementById('game-message').textContent = "成功逃跑，进入大殿...";
      processImage.src = 'images/7.jpg';
      const exitMaze = await TreasureMap.exitMagicMaze();
      console.log(exitMaze);
      document.getElementById('game-message').textContent = "寻宝进度：发现宝箱...";
      processImage.src = 'images/3.jpg';
      const searchTemple = await TreasureMap.searchTemple();
      console.log(searchTemple);
      document.getElementById('game-message').textContent = "寻宝进度：找到宝藏...";
      processImage.src = 'images/4.jpg';
      const treasure = await TreasureMap.openTreasureBox();
      console.log(treasure);
      document.getElementById('game-message').textContent = "寻宝进度：宝藏找到！";
       // 将本次游戏的步骤记录到游戏历史中
       playerInfo.gameHistory.push({
        step: '寻宝完成',
        result: '成功找到宝藏',
        date: new Date().toISOString()
      });

      // 更新本地存储中的玩家信息
      localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
    } catch (error) {
      console.error("任务失败:", error);
      document.getElementById('game-message').textContent = "寻宝进度：任务失败！";

      // 将本次游戏的步骤记录到游戏历史中，标记为失败
      playerInfo.gameHistory.push({
        step: '寻宝失败',
        result: '未找到宝藏',
        date: new Date().toISOString()
      });

      // 更新本地存储中的玩家信息
      localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
    }
  }



  document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('start-button');
  startButton.addEventListener('click', startTreasureHunt);

  function startTreasureHunt() {
    findTreasureWithAsyncAwait();
  }

  // 有游戏历史，显示在页面上
  if (playerInfo.gameHistory.length > 0) {
    const gameHistoryDiv = document.createElement('div');
    gameHistoryDiv.textContent = '游戏历史：';
    playerInfo.gameHistory.forEach((historyItem) => {
      const historyEntry = document.createElement('p');
      historyEntry.textContent = `${historyItem.step} - ${historyItem.result} - ${historyItem.date}`;
      gameHistoryDiv.appendChild(historyEntry);
    });
    document.body.appendChild(gameHistoryDiv);
  }

  // 设置玩家信息相关逻辑
  const playerIDInput = document.createElement('input');
  playerIDInput.type = 'text';
  playerIDInput.placeholder = '请输入玩家ID';
  const nicknameInput = document.createElement('input');
  nicknameInput.type = 'text';
  nicknameInput.placeholder = '请输入昵称';
  const setInfoButton = document.createElement('button');
  setInfoButton.textContent = '设置玩家信息';
  setInfoButton.addEventListener('click', function () {
    playerInfo.playerID = playerIDInput.value;
    playerInfo.nickname = nicknameInput.value;

    // 更新本地存储中的玩家信息
    localStorage.setItem('playerInfo', JSON.stringify(playerInfo));

    // 显示设置成功提示
    const successMessage = document.createElement('p');
    successMessage.textContent = '玩家信息设置成功！';
    successMessage.style.color = 'green';
    document.body.appendChild(successMessage);

    // 显示玩家ID和昵称在图片右上方
    const playerInfoDisplay = document.getElementById('player-info-display');
    playerInfoDisplay.textContent = `玩家ID: ${playerInfo.playerID}  昵称: ${playerInfo.nickname}`;
});

document.body.appendChild(playerIDInput);
      document.body.appendChild(nicknameInput);
      document.body.appendChild(setInfoButton);

    });