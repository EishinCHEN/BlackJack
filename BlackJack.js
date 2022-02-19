let playerName = null;
let deck = [];
let dealerCards = [];
let playerCards = [];
document.getElementById("playerName").addEventListener("keyup",(event)=>{
    if(event.keyCode === 13){
        newGame();
    }
})
//初始化卡片圖案
function initCards(){
    let allCards = document.getElementsByClassName("card-img");
    for(index in allCards){
        allCards[index].innerHTML = "✡";
    }
    let numbers = document.getElementsByClassName("value-zone");
    for(index in numbers){
        numbers[index].innerHTML = "";
    }
}
//新遊戲
function newGame(){
    playerName = document.getElementById("playerName").value;
    if(playerName){
        initCards();
        document.getElementById("winnerImg").classList.add("displaynone");
        document.getElementById("pName").innerHTML = playerName;
        document.getElementById("begin").classList.add("displaynone");
        //清除上一局卡牌
        dealerCards = [];
        playerCards = [];
        //清除上一局畫面
        initCards();
        //發牌
        playerCards.push(deal());
        dealerCards.push(deal());
        playerCards.push(deal());
        //渲染牌面
        renderCards();
        //渲染點數
        document.getElementById("playerPoints").innerHTML = calcPoint(playerCards);
        document.getElementById("dealerPoints").innerHTML = calcPoint(dealerCards);
        if(calcPoint(playerCards) >= 21 || calcPoint(dealerCards) >= 21){
            alert("gameover");
        }else{
        //解除按鈕鎖定
        document.getElementById("hit").removeAttribute("disabled");
        document.getElementById("stand").removeAttribute("disabled");
        }
    }else{
        alert("請輸入玩家名字");
    }
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
//渲染牌面
function renderCards(){
    playerCards.forEach((c,i)=>{
        let cards = document.getElementById(`playerCard${i+1}`);
        let num = document.getElementById(`playerCard${i+1}`).previousSibling;
        cards.innerHTML = c.cardSuit();
        num.innerHTML = c.cardNumber();
    })
    dealerCards.forEach((c,i)=>{
        let cards = document.getElementById(`dealerCard${i+1}`);
        let num = document.getElementById(`dealerCard${i+1}`).previousSibling;
        cards.innerHTML = c.cardSuit();
        num.innerHTML = c.cardNumber();
    })
}
//玩家再來一張！
function hit(){
    if(playerCards.length < 5 && dealerCards.length < 5){
        playerCards.push(deal());
        renderCards();
        document.getElementById("playerPoints").innerHTML = calcPoint(playerCards);
        if(calcPoint(playerCards) >= 21 || calcPoint(dealerCards) >= 21){
            document.getElementById("hit").setAttribute("disabled","");
            document.getElementById("stand").setAttribute("disabled","");
        }
    }
    isWinner(playerCards,dealerCards);
}
//玩家跳過一輪
function stand(){
    if(playerCards.length < 5 && dealerCards.length < 5){
        while(true){
            //若點數比玩家少，則繼續拿牌
            if(calcPoint(dealerCards) < calcPoint(playerCards)){
                dealerCards.push(deal());
                renderCards();
                document.getElementById("dealerPoints").innerHTML = calcPoint(dealerCards);
            }else{
                break;
            }
        }   
    } 
    isWinner(playerCards,dealerCards);
}
//計算點數
function calcPoint(deck){
    let point = 0;
    deck.forEach((p)=>point+=p.cardValue());
    console.log(point);
    if(point > 21){
        console.log("超過21點了")
        deck.forEach(p=>{
                if(p.cardNumber() === "A"){
                    console.log("你有A");
                    point -= 10;
            }
        })
    }
    return point;
}
//找出贏家
function isWinner(playerCards, dealerCards){
    let pPoint = calcPoint(playerCards);
    let dPoint = calcPoint(dealerCards);
    document.getElementById("namespace").innerHTML = playerName;
    document.getElementById("playerPoint").innerHTML = pPoint;
    document.getElementById("dealerPoint").innerHTML = dPoint;
    if(pPoint >= 21 || dPoint >= 21){
        document.getElementById("winnerImg").classList.remove("displaynone");
        document.getElementById("hit").setAttribute("disabled","");
        document.getElementById("stand").setAttribute("disabled","");
        if(pPoint == 21 || dPoint > 21){
            document.getElementById("winnerName").innerHTML = playerName+" 贏了！";
        }else if(dPoint == 21 || pPoint > 21){
            document.getElementById("winnerName").innerHTML = "莊家 贏了！";
        }else if(dPoint == dPoint){
            document.getElementById("winnerName").innerHTML = "平手";
        }else if(playerCards.length == 5 || dealerCards.length == 5){
            (pPoint < 21 )? document.getElementById("winnerName").innerHTML = playerName+"贏了" : document.getElementById("winnerName").innerHTML = "莊家贏了";
        }
    }
}
//卡牌模型
class Card {
    constructor(suit,number){
        this.suit = suit;
        this.number = number;
    }
    cardNumber(){
        switch(this.number){
            case 1:
                return "A";
            case 11:
                return "J";
            case 12:
                return "Q";
            case 13:
                return "K";
            default:
                return this.number;
        }
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