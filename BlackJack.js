import Deck from './Deck.js';
import GameUI from './GameUI.js';

// 遊戲狀態
let playerName = "";
let playerMoney = 1000;
let dealerMoney = 1000;
let currentBet = 0;

let deck = null;
let dealerCards = [];
let playerCards = [];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 初始化事件監聽
// 使用DOMContentLoaded確保DOM載入完成才註冊事件監聽
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("newGame")?.addEventListener("click", initGame);
    document.getElementById("restart")?.addEventListener("click", handleRestart);
    
    // 綁定下注按鈕
    document.getElementById("startBetBtn")?.addEventListener("click", dealHand);

    document.getElementById("hit")?.addEventListener("click", hit);
    document.getElementById("stand")?.addEventListener("click", stand);

    // 規則彈窗事件綁定
    document.getElementById("rulesBtnHome")?.addEventListener("click", () => toggleRulesModal(true));
    document.getElementById("rulesBtnGame")?.addEventListener("click", () => toggleRulesModal(true));
    document.getElementById("closeRulesBtn")?.addEventListener("click", () => toggleRulesModal(false));

    document.getElementById("playerName")?.addEventListener("keyup", (event) => {
        if (event.key === "Enter" || event.keyCode === 13) {
            initGame();
        }
    });
});

// 控制規則彈窗的開關
function toggleRulesModal(show) {
    const rulesModal = document.getElementById("rulesModal");
    if (show) {
        rulesModal?.classList.remove("displaynone");
    } else {
        rulesModal?.classList.add("displaynone");
    }
}

// 初始化整場遊戲（重置 $1000）
function initGame() {
    const nameInput = document.getElementById("playerName")?.value.trim();
    if (!nameInput) return alert("請輸入玩家名字");

    playerName = nameInput;
    playerMoney = 1000;
    dealerMoney = 1000;

    GameUI.updateMoney(playerMoney, dealerMoney);
    document.getElementById("begin")?.classList.add("displaynone");
    document.getElementById("pName").innerText = playerName;

    startNextRound();
}

// 開始新的一局
async function startNextRound() {
    // 隱藏結算圖、顯示下注區塊
    document.getElementById("winnerImg")?.classList.add("displaynone");

    // 清空舊牌面與點數
    GameUI.initCards();
    GameUI.updatePoints("", "");

    // 顯示下注彈窗，並更新輸入框最大值為當前籌碼
    const betInput = document.getElementById("roundBet");
    if (betInput) betInput.max = playerMoney;
    
    document.getElementById("betZone")?.classList.remove("displaynone");
    
    // 停用遊戲按鈕
    GameUI.setButtonsDisabled(true);
}

// 點擊「下注並開局」按鈕觸發
async function dealHand() {
    const betInput = document.getElementById("roundBet");
    let bet = parseInt(betInput?.value || 100);

    if (isNaN(bet) || bet <= 0) {
        alert("請輸入有效的下注金額！");
        return;
    }
    if (bet > playerMoney) {
        alert("籌碼不足！已調整為剩餘籌碼");
        bet = playerMoney;
        if (betInput) betInput.value = bet;
    }

    currentBet = bet;

    // 隱藏下注區，開始發牌
    document.getElementById("betZone")?.classList.add("displaynone");

    // 洗牌與發牌
    deck = new Deck();
    deck.shuffle();
    dealerCards = [];
    playerCards = [];

    playerCards.push(deck.deal());
    dealerCards.push(deck.deal());
    playerCards.push(deck.deal());

    GameUI.renderCards(playerCards, dealerCards);
    GameUI.updatePoints(Deck.calcPoint(playerCards), Deck.calcPoint(dealerCards));

    if (Deck.calcPoint(playerCards) >= 21) {
        await sleep(1000);
        checkResult(true);
    } else {
        GameUI.setButtonsDisabled(false);
    }
}

// 玩家補牌
async function hit() {
    if (playerCards.length < 5) {
        playerCards.push(deck.deal());
        GameUI.renderCards(playerCards, dealerCards);
        
        const pPoint = Deck.calcPoint(playerCards);
        const dPoint = Deck.calcPoint(dealerCards);
        GameUI.updatePoints(pPoint, dPoint);

        // 超過21點或抽滿 5 張即結束
        if (pPoint >= 21 || playerCards.length === 5) {
            GameUI.setButtonsDisabled(true);
            await sleep(1000); // 停頓 1 秒讓玩家看清這張抽到的牌
            checkResult(true);
        }
    }
}

// 玩家停牌 (莊家自動補牌)
async function stand() {
    GameUI.setButtonsDisabled(true);

    // 莊家未滿 17 點且少於 5 張牌時持續補牌
    while (Deck.calcPoint(dealerCards) < 17 && dealerCards.length < 5) {
        await sleep(800); // 每拿一張牌前等待 0.8 秒

        dealerCards.push(deck.deal());

        GameUI.renderCards(playerCards, dealerCards);
        GameUI.updatePoints(Deck.calcPoint(playerCards), Deck.calcPoint(dealerCards));
    }

    await sleep(1200);
    checkResult(true);
}

// 結算與籌碼轉移
function checkResult(gameOver) {
    if (!gameOver) return;

    GameUI.setButtonsDisabled(true);

    const pPoint = Deck.calcPoint(playerCards);
    const dPoint = Deck.calcPoint(dealerCards);
    const pLen = playerCards.length;
    const dLen = dealerCards.length;

    let winnerText = "";
    let result = ""; // 內容為 "win", "lose", "push"

    if (pPoint > 21) {
        winnerText = `${playerName}超過21點，莊家贏了！`;
        result = "lose";
    } else if (dPoint > 21) {
        winnerText = `莊家超過21點，${playerName}贏了！`;
        result = "win";
    } else if (pLen === 5) {
        winnerText = `${playerName} 5 張牌獲勝！`;
        result = "win";
    } else if (dLen === 5) {
        winnerText = "莊家 5 張牌獲勝！";
        result = "lose";
    } else if (pPoint > dPoint) {
        winnerText = `${playerName} 贏了！`;
        result = "win";
    } else if (dPoint > pPoint) {
        winnerText = "莊家 贏了！";
        result = "lose";
    } else {
        winnerText = "平手！";
        result = "push";
    }

    // 結算金錢
    if (result === "win") {
        playerMoney += currentBet;
        dealerMoney -= currentBet;
        winnerText += `\n贏得 $${currentBet}`;
    } else if (result === "lose") {
        playerMoney -= currentBet;
        dealerMoney += currentBet;
        winnerText += `\n損失 $${currentBet}`;
    }

    GameUI.updateMoney(playerMoney, dealerMoney);

    // 檢查是否破產
    const isBankrupt = playerMoney <= 0 || dealerMoney <= 0;
    if (playerMoney <= 0) winnerText = `${playerName}籌碼歸零，徹底破產！`;
    if (dealerMoney <= 0) winnerText = "莊家籌碼歸零，莊家破產！";

    GameUI.showWinner(winnerText, playerName, pPoint, dPoint, isBankrupt);
}

// 彈出視窗按鈕
function handleRestart() {
    if (playerMoney <= 0 || dealerMoney <= 0) {
        // 破產時重新回到首頁重置籌碼
        document.getElementById("winnerImg")?.classList.add("displaynone");
        document.getElementById("begin")?.classList.remove("displaynone");
    } else {
        // 未破產繼續下一局
        startNextRound();
    }
}