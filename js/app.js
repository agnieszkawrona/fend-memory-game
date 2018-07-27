/*
 * Create a list that holds all of your cards
 */

const cardsList = ["fa fa-diamond", "fa fa-diamond", "fa fa-cube", "fa fa-cube",
"fa fa-paper-plane-o", "fa fa-paper-plane-o", "fa fa-leaf", "fa fa-leaf",
"fa fa-anchor", "fa fa-anchor", "fa fa-bolt", "fa fa-bolt", "fa fa-bicycle",
"fa fa-bicycle", "fa fa-bomb", "fa fa-bomb"];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/

const cardsContainer = document.querySelector(".deck");

let flippedCards = [];
let foundPairs = [];

const restartButton = document.querySelector(".restart");

const movesCounter = document.querySelector(".moves");
let moves = 0;

const starRating = document.querySelector(".stars");

const timerContainer = document.querySelector(".timer");
let liveTimer, totalSec = 0;
timerContainer.innerHTML = totalSec;
let firstClick = true;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//function: display card's symbol
function showSymbol(card){
  card.classList.add("open", "show", "disabled");
}

// function: add the card to a list of open cards
function flipCard(card, flippedCards){
  flippedCards.push(card);
}

//function: lock the cards in the open position if matched
function compareFlippedCards(card, flippedCards, foundPairs){
  if (card.innerHTML === flippedCards[0].innerHTML){
    card.classList.add("match");
    flippedCards[0].classList.add("match");
    foundPairs.push(card);
    foundPairs.push(flippedCards[0]);

  } else {
    setTimeout(function() {
      card.classList.remove("open", "show", "disabled");
      flippedCards[0].classList.remove("open", "show", "disabled");
    }, 700);
  }
  countMoves();
  areWeDone();
}

//function: check if the game is finished; if it is, display a message with a final score
function areWeDone(){
  let starsResult = "";
  let showTime = timerContainer.innerHTML;
  if (foundPairs.length === cardsList.length) {
    stopTimer();
    if (starRating.innerHTML == `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>`) {
      starsResult = "***";
    } else if (starRating.innerHTML == `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>`) {
      starsResult = "**";
    } else {
      starsResult = "*";
    }
    if (confirm("You made it! CONGRATS! \n Your score is:  "+starsResult+ "\n Your time: " + showTime + "s\n Your number of moves: " + moves)) {
      cardsContainer.innerHTML = "";
      init();
      foundPairs = [];
    } else {
      alert("see ya!");
    }
  }
}

//function: increment the move counter
function countMoves(){
  moves++;
  movesCounter.innerHTML = moves;
  rateGame();
}

//function: game rating
function rateGame(){
  switch(moves) {
    case 8:
      starRating.innerHTML = `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>`;
    break;
    case 12:
      starRating.innerHTML = `<li><i class="fa fa-star"></i></li>`;
    break;
  }
}

//function: timer
function startTimer() {
  liveTimer = setInterval(function() {
    totalSec += 1;
    timerContainer.innerHTML = totalSec;
  },1000);
}

function stopTimer(){
  clearInterval(liveTimer);
}

// initialize the game
function init() {
  const cards = shuffle(cardsList);
  moves = 0;
  movesCounter.innerHTML = 0;
  starRating.innerHTML = `<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>`;
  for(let i=0; i<cards.length; i++) {
    const card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = "<i class='" + cards[i] + "'></i>";
    cardsContainer.appendChild(card);
    card.addEventListener("click", function(){
      if(firstClick) {
        startTimer();
        firstClick = false;
      }
      if(flippedCards.length === 1){
        showSymbol(card);
        flipCard(this, flippedCards);
        compareFlippedCards(this, flippedCards, foundPairs);
        flippedCards = [];
      } else {
        showSymbol(card);
        flipCard(this, flippedCards);
      }
    })
  }
}

//function: restart Game
restartButton.addEventListener("click",function() {
  stopTimer();
  firstClick = true;
  cardsContainer.innerHTML = "";
  init();
  foundPairs = [];
  flippedCards = [];
  totalSec = 0;
  timerContainer.innerHTML = totalSec;
})

init();
