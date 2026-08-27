# 單機版21點比大小遊戲

基於JavaScript (ES6) 開發的單機 21 點遊戲。
玩家將與莊家(電腦)進行 1 對 1 對決，體驗籌碼下注、比點數與破產挑戰的樂趣！

<div align="center">
  <img src="https://github.com/EishinCHEN/BlackJack/blob/69e651cd165b457440bb93914778dd853c15db58/Images/gaming.jpg" width="45%" style="margin-right: 10px;">
  <img src="https://github.com/EishinCHEN/BlackJack/blob/69e651cd165b457440bb93914778dd853c15db58/Images/result.jpeg" width="45%">
</div>

---

## 技術架構

**ES6 ES Modules**：採用原生模組化架構，遵循高內聚、低耦合原則拆分檔案：
- `Card.js`：卡牌模型與花色/數字顯示轉換。
- `Deck.js`：牌組初始化、洗牌演算法與點數計算邏輯。
- `GameUI.js`：DOM 操作與畫面渲染邏輯封裝。
- `BlackJack.js`：遊戲核心流程、異步動畫與狀態控制。
