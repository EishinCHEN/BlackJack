window.onload=()=>{
    initCards();
    newGame();
}
let deck = [];
let dealerCards = [];
let playerCards = [];
//初始化卡片圖案
function initCards(){
    let allCards = document.getElementsByClassName("card-img");
    for(index in allCards){
        allCards[index].innerHTML = "✡";
    }
}
//新遊戲
function newGame(){
    dealerCards = [];
    playerCards = [];
    playerCards.push(deal());
    dealerCards.push(deal());
    playerCards.push(deal());
    renderCards();
}
//建立牌組
function buildDeck(){
    for(let suit = 1 ; suit <= 4 ; suit++){
        for(let number = 1 ; number <= 13 ; number++){
            let card = new Card(suit,number)
            deck.push(card);
        }
    }
    return deck;
}
//洗牌 https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  
//發牌
function deal(){
    deck = shuffle(buildDeck());
    return deck.shift();
}
function renderCards(){
    playerCards.forEach((c,i)=>{
        let cards = document.getElementById(`playerCard${i+1}`);
        let num = document.getElementById(`playerCard${i+1}`).previousSibling;
        cards.innerHTML = c.cardSuit();
        num.innerHTML = c.cardValue();
    })
    dealerCards.forEach((c,i)=>{
        let cards = document.getElementById(`dealerCard${i+1}`);
        let num = document.getElementById(`dealerCard${i+1}`).previousSibling;
        cards.innerHTML = c.cardSuit();
        num.innerHTML = c.cardValue();
    })
}
class Card {
    constructor(suit,number){
        this.suit = suit;
        this.number = number;
    }
    //計算點數
    cardValue(){
        switch(this.number){
            case 1:
                return 11;
            case 11:
            case 12:
            case 13:
                return 10;
            default:
                return this.number;
        }
    }
    cardSuit(){
        switch(this.suit){
            case 1:
                return "♠";
            case 2:
                return "♣";
            case 3:
                return "♥";
            case 4:
                return "♦";
        }
    }
}