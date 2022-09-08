import { cardArray } from './data.js';

// 收集材料：選取需要的 element
const grid = document.querySelector('.grid');
const result = document.querySelector('#result');
const overlay = document.querySelector('.overlay');
const restartBtn = document.querySelector('.btn-restart');
const againBtn = document.querySelector('.btn-again');

let scores = 0;
let pickedCards = [];
let pickedCardIds = [];
let lastClicked = '';

// shuffle array 隨機陣列: sort() or Fisher-Yates algorithm
// cardArray.sort(() => 0.5 - Math.random());
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; //swapping variables
  }
}

// 製作遊戲畫面
function createGameBoard() {
  shuffle(cardArray);
  cardArray.forEach((_, index) => {
    // 製作卡片
    const img = document.createElement('img');
    img.setAttribute('src', '../img/blank.png');
    img.setAttribute('data-id', index);

    //呈現在畫面上 （append vs appendChild）
    grid.append(img);

    // 每張卡片綁定監聽器：click event
    img.addEventListener('click', handleClick);
  });

  //初始化分數
  result.innerText = scores;
}

// 想法：click -> 隨機選取 cardArray 之一 element --> 呈現在畫面上
function handleClick() {
  if (pickedCardIds.includes(this.dataset.id)) return;
  //   if (lastClicked === this) return; //解決點擊同一個會誤認為兩張相同卡片的問題

  //把卡片背景圖片換成內容圖片
  const cardImg = cardArray[this.dataset.id];
  this.src = `${cardImg.img}`;

  //把翻開的（點擊過的）卡片資訊存起來
  pickedCards.push(cardImg.name); //名字: check if they match
  pickedCardIds.push(this.dataset.id); //<img>id

  // 檢查是否 match（兩張卡片是否相同）
  pickedCards.length >= 2 && checkMatch();
  console.log(pickedCardIds);

  //將這次點擊的卡片記錄起來，以解決點擊同一個會誤認為兩張相同卡片的問題
  //   lastClicked = this;

  //確認是否贏了遊戲（分數有 5)
  checkWin();
}

// 想法：選取的卡片至少兩張時 -> 兩張相同的話 --> 分數加一
//                        -> 兩張不同的話 --> 繼續點擊第三張 --> 前兩張變回背景圖片
function checkMatch() {
  const cards = document.querySelectorAll('img');

  //解構 destructuring: 分別取得選取的第一張與第二張卡片的資訊
  const [cardOne, cardTwo] = pickedCards;
  const [cardOneId, cardTwoId] = pickedCardIds;

  //如果卡片相同：總分加一、移除該卡片的監聽者
  if (cardOne === cardTwo) {
    scores++;
    result.innerText = scores;
    cards[cardOneId].removeEventListener('click', handleClick);
    cards[cardTwoId].removeEventListener('click', handleClick);

    //淨空存放選取的卡片資訊，方便之後繼續進行判斷
    pickedCards = [];
    pickedCardIds = [];
  } else {
    // 如果兩張卡片不相同：點擊第三張時，兩張圖片重新設回背景圖
    if (pickedCards.length === 3) {
      cards[cardOneId].src = '../img/blank.png';
      cards[cardTwoId].src = '../img/blank.png';

      //剔除前兩張卡片（要保留第三張），方便之後繼續進行判斷
      pickedCards.splice(0, 2);
      pickedCardIds.splice(0, 2);
    }
  }
}

// 確認是否贏了：分數等於 5 時，顯示 overlay
function checkWin() {
  if (scores === 5) {
    overlay.style.display = 'block';
  }
}

// 遊戲中的重新開始
function handleRestart() {
  document.querySelectorAll('img').forEach((img) => img.remove());
  createGameBoard();
  scores = 0;
  result.innerText = scores;
  pickedCards = [];
  pickedCardIds = [];
}

//贏了之後的再玩一次
function handleAgain() {
  overlay.style.display = 'none';
  handleRestart();
}

createGameBoard();
restartBtn.addEventListener('click', handleRestart);
againBtn.addEventListener('click', handleAgain);
