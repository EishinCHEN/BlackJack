export default class Card {
    constructor(suit, number) {
        this.suit = suit;     // 花色 1~4
        this.number = number; // 數字 1~13
    }

    // 取得撲克牌顯示文字（A, J, Q, K 或數字）
    cardNumber() {
        switch(this.number) {
            case 1:  return "A";
            case 11: return "J";
            case 12: return "Q";
            case 13: return "K";
            default: return this.number.toString();
        }
    }

    // 取得卡牌基本點數（A預設算11分，J/Q/K算10分）
    cardValue() {
        if (this.number === 1) return 11;
        if (this.number >= 11) return 10;
        return this.number;
    }

    // 取得花色符號
    cardSuit() {
        const suits = ["♠", "♣", "♥", "♦"];
        return suits[this.suit - 1] || "";
    }
}