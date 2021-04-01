const prices = [
  {write: 'Royal Flush', molt: 'x 100', win: 100},
  {write: 'Four of a kind', molt: 'x 50', win: 50},
  {write: 'Full house', molt: 'x 25', win: 25},
  {write: 'Flush', molt: 'x 10', win: 10},
  {write: 'Straight', molt: 'x 5', win: 5},
  {write: 'Three of a kind', molt: 'x 3', win: 3},
  {write: 'Two pairs', molt: 'x 2', win: 2},
  {write: 'High pair', molt: 'x 1', win: 1}
];

const seeds = ['C','H','D','S'];
const cardValues = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const cardNumbers = [2,3,4,5,6,7,8,9,10,11,12,13,14];
const png = '.png';

const backCard = './Cards/red_back.png';

function newDeck(){
  const deck = [];
  for(let a=0; a<cardValues.length; a++){
    for(let b=0; b<seeds.length; b++){
      const image = './Cards/' + cardValues[a] + seeds[b] + png;
      const card = {seed: seeds[b], value: cardNumbers[a], image: image};
      deck.push(card);
    }
  }
  return deck;
}

const coins = [1,2,5,10,20,50,100];
let placedIndex = 0;
let placed = 1;
let stack = 500;
let cardsInPlay = [];
let cardsToSwap =[];
let deckInPlay;
let counter = 52;
let middle;
let mobileCard;
let keys = [];
let swappingCounter = 0;
let swapping = false;
let showing = true;
let betActivator = true;
let swappCompleted = false;
let win;
let finalValues;
let finalSeeds;

function checkForFlush(seeds){
  if(seeds[0] === seeds[1] && seeds[1] === seeds[2] && seeds[2] === seeds[3] && seeds[3] === seeds[4]){
    return 'Flush';
  }
  return false;
}
function checkForStair(cards){
  if(cards[0] === 2 && cards[1] === 3 && cards[2] === 4 && cards[3] === 5 && cards[4] === 14){
    return 'Straight';
  } else if(cards[0] + 1 ===cards[1] && cards[1] + 1 ===cards[2] && cards[2] + 1 ===cards[3] && cards[3] + 1 ===cards[4]) {
    return 'Straight';
  }
  return false;
}
function checkForPoker(cards){
  if(cards[0] === cards[1] && cards[1] === cards[2] && cards[2] === cards[3]){
    return 'Four of a kind';
  } else if(cards[4] === cards[1] && cards[1] === cards[2] && cards[2] === cards[3]){
    return 'Four of a kind';
  }
  return false;
}
function checkForFull(cards){
  if((cards[0] === cards[1] && cards[1] === cards[2]) && (cards[3] === cards[4])){
    return 'Full house';
  } else if ((cards[4] === cards[3] && cards[3] === cards[2]) && (cards[0] === cards[1])){
    return 'Full house';
  }
  return false;
}
function checkForTris(cards){
  if((cards[0] === cards[1] && cards[1] === cards[2]) || (cards[1] === cards[2] && cards[2] === cards[3]) || (cards[2] === cards[3] && cards[3] === cards[4])){
    return 'Three of a kind';
  }
  return false;
}
function checkForDouble(cards){
  if(cards[0] === cards[1]){
    if(cards[2] === cards[3] || cards[3] === cards[4]){
      return 'Two pairs';
    }
  } else if (cards[1] === cards[2] && cards[3] === cards[4]){
    return 'Two pairs';
  }
  return false;
}
function checkForPair(cards){
  if(((cards[0] === cards[1] || cards[1] === cards[2]) && cards[1] >= 10) || ((cards[2] === cards[3] || cards[3] === cards[4]) && cards[3] >= 10)){
    return 'High pair';
  }
  return false;
}

function analyzeGame(values, seeds){
  if(checkForFlush(seeds)){
    if(checkForStair(values)){
      return 'Royal Flush';
    } else return checkForFlush(seeds);
  } else if(checkForStair(values)){
    return(checkForStair(values));
  } else if(checkForPoker(values)){
    return(checkForPoker(values));
  } else if(checkForFull(values)){
    return checkForFull(values);
  } else if(checkForTris(values)){
    return checkForTris(values);
  } else if(checkForDouble(values)){
    return checkForDouble(values);
  } else if(checkForPair(values)){
    return checkForPair(values);
  } else return 'You Lose';
}

document.addEventListener('DOMContentLoaded', function() {

  const stackH = document.querySelector('.stack .number');
  const betH = document.querySelector('.bet .number');
  const line = document.querySelector('.line');
  const plus = document.querySelector('.plus');
  const minus = document.querySelector('.minus');
  const reset = document.querySelector('.reset');
  const play = document.querySelector('.play');
  const amount = document.querySelector('.amount');
  const cards = document.querySelectorAll('.card');
  const priceWrite = document.querySelector('.prices-container-left');
  const priceValue = document.querySelector('.prices-container-right');
  const swapBoxes = document.querySelectorAll('.swap-box');
  const wins = document.querySelector('.wins');

  for(let a =0; a<prices.length; a++){
    const right = document.createElement('div');
    const left = document.createElement('div');
    right.classList.add('price-text');
    right.innerText = prices[a].write;
    left.classList.add('price-value');
    left.innerText = prices[a].molt;
    priceWrite.appendChild(right);
    priceValue.appendChild(left);
  }

  const priceText = document.querySelectorAll('.price-text');
  const priceValues = document.querySelectorAll('.price-value');

  function flashForWin(){
    for(let a=0; a<priceText.length; a++){
      if(win[0] === priceText[a].innerText){
        priceText[a].classList.add('animated-text');
        priceValues[a].classList.add('animated-value');
        console.log(priceText);
      }
    }
  }

  function resetFlash(){
    for(let a=0; a<priceText.length; a++){
      priceText[a].classList.remove('animated-text');
      priceValues[a].classList.remove('animated-value');
    }
  }

  function reverseCards(){
    cards.forEach(card =>{
      card.src = backCard;
    });
  }

  function resetGame(){
    reverseCards();
    cardsInPlay = [];
    cardsToSwap = [];
    deckInPlay = [];
    counter = 52;
    deckInPlay = newDeck();
    keys = [];
    swappingCounter = 0;
    win = 0;
  }

  stackH.innerText = stack;
  amount.innerText = coins[placedIndex];

  plus.addEventListener('click', function(){
    if(betActivator){
      placedIndex === coins.length - 1 ? placedIndex = 0 : placedIndex ++;
      amount.innerText = coins[placedIndex];
      placed = coins[placedIndex];
    }
  });

  minus.addEventListener('click', function(){
    if(betActivator){
      placedIndex === 0 ? placedIndex = coins.length - 1 : placedIndex --;
      amount.innerText = coins[placedIndex];
      placed = coins[placedIndex];
    }
  });

  reset.addEventListener('click', function(){
    if(betActivator){
      placedIndex = 0;
      amount.innerText = coins[placedIndex];
    }
  });

  function betPlacable(){
    if(stack>=placed){
      return true;
    }
    return false;
  }

  function betPlaced(){
    line.innerText = '';
    betH.innerText = placed;
    stack = stack - placed;
    stackH.innerText = stack;
    betActivator = false;
  }

  function generateRandom(){
    const rnd = Math.floor(Math.random() * counter);
    counter--;
    return rnd;
  }

  function generateStartingCards (){
    for(let a=0; a<5; a++){
      middle = generateRandom();
      mobileCard = {
        key: a,
        active: false,
        selected: false,
        card: deckInPlay[middle]
      };
      deckInPlay.splice(middle,1);
      cardsInPlay.push(mobileCard);
    }
  }

  function showFirstCards(cont){
    if(cont < 5){
      setTimeout(function(){
        cards[cont].src = cardsInPlay[cont].card.image;
        cont++;
        showFirstCards(cont);
      }, 250);
    }
  }

  function resetSwapBoxes(){
    swapBoxes.forEach(box => {
      box.innerText = '';
    });
  }

  function resetCardsClass(){
    cards.forEach(card => {
      card.classList.add('card');
      card.classList.remove('card-selected');
    });
  }

  function numberOfCardsToSwap(index){
    if(!cardsInPlay[index].selected){
      swappingCounter ++;
      cardsInPlay[index].selected = !cardsInPlay[index].selected;
      keys.push(cardsInPlay[index].key);
      swapBoxes[index].innerText = 'Swap';
      cards[index].classList.add('card-selected');
      cards[index].classList.remove('card');
    } else {
      swappingCounter --;
      cardsInPlay[index].selected = !cardsInPlay[index].selected;
      swapBoxes[index].innerText = '';
      cards[index].classList.add('card');
      cards[index].classList.remove('card-selected');
      for(let b=0; b<keys.length; b++){
        if(keys[b] === cardsInPlay[index].key){
          keys.splice(b,1);
        }
      }
    }
  }

  function generateCardsToSwap(swappingCounter,keys){
    for(let a=0; a<swappingCounter; a++){
      middle = generateRandom();
      mobileCard = {
        key: keys[a],
        active: false,
        selected: false,
        card: deckInPlay[middle]
      };
      deckInPlay.splice(middle,1);
      cardsToSwap.push(mobileCard);
    }
  }

  function reverseSelected(){
    for(let a=0; a<cardsToSwap.length; a++){
      cards[cardsToSwap[a].key].src = backCard;
    }
  }

  function swapSelected(index){
    for(let b=0; b<cardsToSwap.length; b++){
      if(cardsToSwap[b].key === index){
        cardsInPlay[cardsToSwap[b].key].active = false;
        return cardsToSwap[b].card.image;
      }
    }
  }

  function swappAll(){
    for(let a=0; a<cardsToSwap.length; a++){
      cards[cardsToSwap[a].key].src = cardsToSwap[a].card.image;
    }
  }

  function modifyStartingCards(){
    for(let a=0;a<cardsToSwap.length;a++){
      cardsInPlay[cardsToSwap[a].key] = cardsToSwap[a];
      cardsInPlay[cardsToSwap[a].key].active = true;
    }
  }

  function activateCards(){
    cardsInPlay.forEach( (card) => {
      card.active = true;
    });
  }

  function disactivateCards(){
    cardsInPlay.forEach( (card) => {
      card.active = false;
    });
  }

  function assignFinalSeeds(){
    finalSeeds = [];
    cardsInPlay.forEach(card =>{
      finalSeeds.push(card.card.seed);
    });
  }

  function assignFinalValues(){
    finalValues = [];
    cardsInPlay.forEach(card =>{
      finalValues.push(card.card.value);
    });
    finalValues.sort((a,b) => a - b);
  }

  function assignWin(){
    assignFinalSeeds();
    assignFinalValues();
    const checkForWin = analyzeGame(finalValues,finalSeeds);
    if(checkForWin === 'You Lose'){
      return ['You Lose', 0];
    } else {
      for (let a=0; a<prices.length; a++){
        if(prices[a].write === checkForWin){
          return [prices[a].write, prices[a].win];
        }
      }
      return 'There is an error somewhere';
    }
  }

  for(let a=0; a<cards.length; a++){
    cards[a].addEventListener('click', function(){
      if(cardsInPlay[a].active){
        if(!showing){
          if(cardsInPlay.length>0){
            if(cardsInPlay[a].active){
              numberOfCardsToSwap(a);
            }
          }
        } else {
          swappingCounter --;
          if(swapSelected(a)){
            cards[a].src = swapSelected(a);
          }
          if(swappingCounter === 0){
            concludeGame();
          }
        }
      }
    });
  }

  function startGame(){
    if(betPlacable()){
      wins.innerText = '';
      play.innerText = 'Swap';
      swapping = !swapping;
      resetFlash();
      resetGame();
      betPlaced();
      generateStartingCards();
      showFirstCards(0);
      activateCards();
      showing = !showing;
    } else {
      line.innerText = 'Not Enough Money!!';
    }
  }

  function continueGame(){
    play.innerText = 'Reveal All';
    generateCardsToSwap(swappingCounter,keys);
    reverseSelected();
    swapSelected();
    disactivateCards();
    modifyStartingCards();
    showing = !showing;
    resetSwapBoxes();
    resetCardsClass();
    swappCompleted = !swappCompleted;
    if(swappingCounter===0){
      concludeGame();
    }
  }

  function concludeGame(){
    swappAll();
    betActivator = true;
    swappCompleted = !swappCompleted;
    swapping = !swapping;
    play.innerText = 'Play';
    win = assignWin();
    const amountWon = (parseInt(betH.innerText) * win[1]);
    stack = stack + amountWon;
    stackH.innerText = stack;
    if(amountWon === 0){
      wins.classList.remove('green');
      wins.classList.add('red');
      wins.innerText = win[0];
    } else {
      wins.classList.remove('red');
      wins.classList.add('green');
      wins.innerText = 'You won' + ' ' + (parseInt(betH.innerText) * win[1]);
    }
    flashForWin();
  }

  play.addEventListener('click', function(){
    if(!swapping){
      startGame();
    } else {
      !swappCompleted ? continueGame() : concludeGame();
    }
  });

});
