export default class GameUI {
    // 重置牌面與點數區塊
    static initCards() {
        const allCards = document.getElementsByClassName("card-img");
        for (let card of allCards) {
            card.innerHTML = "✪";
            card.parentElement?.classList.remove("card-deal", "card-flip");
        }
        const numbers = document.getElementsByClassName("value-zone");
        for (let num of numbers) {
            num.innerHTML = "";
        }
    }

    // 渲染玩家與莊家的手牌
    static renderCards(playerCards, dealerCards) {
        playerCards.forEach((card, i) => {
            const cardBox = document.getElementById(`playerCard${i + 1}`)?.parentElement;
            const cardSuitElem = document.getElementById(`playerCard${i + 1}`);
            const cardNumElem = cardSuitElem?.previousSibling;

            // 只有內容原本是空的時才播放發牌動畫
            if (cardBox && cardSuitElem.innerHTML === "✪") {
                // 先移除動畫 Class 以重置狀態
                cardBox.classList.remove("card-deal");
                
                // 強制瀏覽器重繪，確保動畫能重複觸發
                void cardBox.offsetWidth;

                // 加上動畫 Class 播放發牌滑入動畫
                cardBox.classList.add("card-deal");
            }

            if (cardSuitElem) cardSuitElem.innerHTML = card.cardSuit();
            if (cardNumElem) cardNumElem.innerHTML = card.cardNumber();
        });

        dealerCards.forEach((card, i) => {
            const cardBox = document.getElementById(`dealerCard${i + 1}`)?.parentElement;
            const cardSuitElem = document.getElementById(`dealerCard${i + 1}`);
            const cardNumElem = cardSuitElem?.previousSibling;

            if (cardBox && cardSuitElem.innerHTML === "✪") {
                cardBox.classList.remove("card-deal");
                void cardBox.offsetWidth;
                cardBox.classList.add("card-deal");
            }

            if (cardSuitElem) cardSuitElem.innerHTML = card.cardSuit();
            if (cardNumElem) cardNumElem.innerHTML = card.cardNumber();
        });
    }

    // 更新點數文字
    static updatePoints(playerPoint, dealerPoint) {
        document.getElementById("playerPoints").innerHTML = playerPoint;
        document.getElementById("dealerPoints").innerHTML = dealerPoint;
    }

    // 切換按鈕的停用/啟用狀態
    static setButtonsDisabled(disabled) {
        const hitBtn = document.getElementById("hit");
        const standBtn = document.getElementById("stand");

        if (disabled) {
            hitBtn.setAttribute("disabled", "true");
            standBtn.setAttribute("disabled", "true");
        } else {
            hitBtn.removeAttribute("disabled");
            standBtn.removeAttribute("disabled");
        }
    }

    // 顯示勝負與籌碼變動結果
    static showWinner(winnerText, playerName, playerPoint, dealerPoint, isBankrupt) {
        document.getElementById("winnerImg").classList.remove("displaynone");
        document.getElementById("namespace").innerHTML = playerName;
        document.getElementById("playerPoint").innerHTML = playerPoint;
        document.getElementById("dealerPoint").innerHTML = dealerPoint;
        
        const restartBtn = document.getElementById("restart");
        if (isBankrupt) {
            document.getElementById("winnerName").innerText = `${winnerText}\n遊戲結束，請重新開始！`;
            restartBtn.value = "重新開局";
        } else {
            document.getElementById("winnerName").innerText = `${winnerText} 準備進入下一局`;
            restartBtn.value = "繼續下注";
        }
    }

    // 更新籌碼顯示
    static updateMoney(playerMoney, dealerMoney) {
        document.getElementById("playerMoney").innerText = playerMoney;
        document.getElementById("dealerMoney").innerText = dealerMoney;
    }
}