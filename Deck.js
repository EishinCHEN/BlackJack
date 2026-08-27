import Card from './Card.js';

export default class Deck {
    // 牌組邏輯與點數計算
    constructor() {
        this.cards = [];
        this.reset();
    }

    // 初始化 52 張全新牌組
    reset() {
        this.cards = [];
        for (let suit = 1; suit <= 4; suit++) {
            for (let number = 1; number <= 13; number++) {
                this.cards.push(new Card(suit, number));
            }
        }
    }

    // Fisher-Yates 洗牌演算法
    // 可參考 https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    shuffle() {
        let currentIndex = this.cards.length;
        while (currentIndex !== 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // 解構賦值 (Destructuring) 進行數值交換
            [this.cards[currentIndex], this.cards[randomIndex]] = 
            [this.cards[randomIndex], this.cards[currentIndex]];
        }
    }

    // 發一張牌
    deal() {
        return this.cards.shift();
    }

    // 計算手牌的總點數
    static calcPoint(handCards) {
        let point = 0;
        let aceCount = 0;

        handCards.forEach(card => {
            point += card.cardValue();
            if (card.cardNumber() === "A") {
                aceCount++; // 紀錄有幾張 A
            }
        });

        // 當點數 > 21 且有 A 可以當 1 點算，就扣除 10 點
        while (point > 21 && aceCount > 0) {
            point -= 10;
            aceCount--;
        }

        return point;
    }
}