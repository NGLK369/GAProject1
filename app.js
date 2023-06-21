// Constants
const DECK = [
  '2\u2665', '3\u2665', '4\u2665', '5\u2665', '6\u2665', '7\u2665', '8\u2665', '9\u2665', '10\u2665', 'J\u2665', 'Q\u2665', 'K\u2665', 'A\u2665',
  '2\u2666', '3\u2666', '4\u2666', '5\u2666', '6\u2666', '7\u2666', '8\u2666', '9\u2666', '10\u2666', 'J\u2666', 'Q\u2666', 'K\u2666', 'A\u2666',
  '2\u2663', '3\u2663', '4\u2663', '5\u2663', '6\u2663', '7\u2663', '8\u2663', '9\u2663', '10\u2663', 'J\u2663', 'Q\u2663', 'K\u2663', 'A\u2663',
  '2\u2660', '3\u2660', '4\u2660', '5\u2660', '6\u2660', '7\u2660', '8\u2660', '9\u2660', '10\u2660', 'J\u2660', 'Q\u2660', 'K\u2660', 'A\u2660'
];
const VALUES = {
  '2\u2665': 2, '3\u2665': 3, '4\u2665': 4, '5\u2665': 5, '6\u2665': 6, '7\u2665': 7, '8\u2665': 8, '9\u2665': 9, '10\u2665': 10, 'J\u2665': 10, 'Q\u2665': 10, 'K\u2665': 10, 'A\u2665': 11,
  '2\u2666': 2, '3\u2666': 3, '4\u2666': 4, '5\u2666': 5, '6\u2666': 6, '7\u2666': 7, '8\u2666': 8, '9\u2666': 9, '10\u2666': 10, 'J\u2666': 10, 'Q\u2666': 10, 'K\u2666': 10, 'A\u2666': 11,
  '2\u2663': 2, '3\u2663': 3, '4\u2663': 4, '5\u2663': 5, '6\u2663': 6, '7\u2663': 7, '8\u2663': 8, '9\u2663': 9, '10\u2663': 10, 'J\u2663': 10, 'Q\u2663': 10, 'K\u2663': 10, 'A\u2663': 11,
  '2\u2660': 2, '3\u2660': 3, '4\u2660': 4, '5\u2660': 5, '6\u2660': 6, '7\u2660': 7, '8\u2660': 8, '9\u2660': 9, '10\u2660': 10, 'J\u2660': 10, 'Q\u2660': 10, 'K\u2660': 10, 'A\u2660': 11
};

// Game state
let deck = [];
let dealerHand = [];
let player1Hand = [];
let player2Hand = [];
let player1Stood = false;
let player2Stood = false;
let dealerStood = false;

// Scoreboard
let dealerWins = 0;
let dealerLosses = 0;
let dealerDraws = 0;
let player1Wins = 0;
let player1Losses = 0;
let player1Draws = 0;
let player2Wins = 0;
let player2Losses = 0;
let player2Draws = 0;

// Button elements
const dealBtn = document.querySelector('#dealBtn');
const hitBtn = document.querySelector('#hitBtn');
const nextBtn = document.querySelector('#nextBtn');
const p1HitBtn = document.querySelector('#p1HitBtn');
const p1StandBtn = document.querySelector('#p1StandBtn');
const p2HitBtn = document.querySelector('#p2HitBtn');
const p2StandBtn = document.querySelector('#p2StandBtn');
const dealerStandBtn = document.querySelector('#dealerStandBtn');

// UI elements
const dealerCardsElement = document.querySelector('#dealerCards');
const player1CardsElement = document.querySelector('#player1Cards');
const player2CardsElement = document.querySelector('#player2Cards');
const dealerTotalElement = document.querySelector('#dealerTotal');
const player1TotalElement = document.querySelector('#player1Total');
const player2TotalElement = document.querySelector('#player2Total');
const player1StatusElement = document.querySelector('#player1Status');
const player2StatusElement = document.querySelector('#player2Status');
const dealerStatusElement = document.querySelector('#dealerStatus');
const winsElement = document.querySelector('#wins');
const lossesElement = document.querySelector('#losses');
const drawsElement = document.querySelector('#draws');

// Disable/Enable buttons
function disableButtons() {
  dealBtn.disabled = true;
  hitBtn.disabled = true;
  p1HitBtn.disabled = true;
  p1StandBtn.disabled = true;
  p2HitBtn.disabled = true;
  p2StandBtn.disabled = true;
  dealerStandBtn.disabled = true;
}

function enableDealButton() {
  dealBtn.disabled = false;
}

function enablePlayerButtons() {
  hitBtn.disabled = false;
  p1HitBtn.disabled = false;
  p1StandBtn.disabled = false;
  p2HitBtn.disabled = false;
  p2StandBtn.disabled = false;
  dealerStandBtn.disabled = false;
}

// Deal a card
function dealCard(hand) {
  const cardIndex = Math.floor(Math.random() * deck.length);
  const card = deck.splice(cardIndex, 1)[0];
  hand.push(card);
  return card;
}

// Calculate hand value
function calculateHandValue(hand) {
  let sum = 0;
  let numAces = 0;

  for (let i = 0; i < hand.length; i++) {
    const card = hand[i];
    const value = VALUES[card];
    sum += value;

    if (card.endsWith('\u2665') || card.endsWith('\u2666') || card.endsWith('\u2663') || card.endsWith('\u2660')) {
      numAces++;
    }
  }

  // Adjust for aces
  while (sum > 21 && numAces > 0) {
    sum -= 10;
    numAces--;
  }

  return sum;
}

// Update UI with card values
function updateUI() {
  dealerCardsElement.textContent = dealerHand.join(', ');
  player1CardsElement.textContent = player1Hand.join(', ');
  player2CardsElement.textContent = player2Hand.join(', ');
}

// Calculate total value of a hand
function calculateTotal(hand) {
  let total = 0;
  for (let i = 0; i < hand.length; i++) {
    const card = hand[i];
    const value = VALUES[card];
    total += value;
  }
  return total;
}

// Update UI with total values
function displayTotal() {
  dealerTotalElement.textContent = calculateTotal(dealerHand);
  player1TotalElement.textContent = calculateTotal(player1Hand);
  player2TotalElement.textContent = calculateTotal(player2Hand);
}

// Check for a blackjack
function checkBlackjack(hand) {
  return hand.length === 2 && calculateHandValue(hand) === 21;
}

// Check if hand busts
function isBust(hand) {
  return calculateHandValue(hand) > 21;
}

// Check if all players and dealer have clicked the Stand button
function isAllStandClicked() {
  return player1Stood && player2Stood && dealerStood;
}

// Determine the win, lose, or draw status
function determineStatus() {
  const dealerTotal = calculateHandValue(dealerHand);
  const player1Total = calculateHandValue(player1Hand);
  const player2Total = calculateHandValue(player2Hand);

  if (isBust(dealerHand)) {
    player1StatusElement.textContent = 'Win';
    player2StatusElement.textContent = 'Win';
    dealerStatusElement.textContent = 'Bust';
    dealerLosses++;
  } else if (isBust(player1Hand) && isBust(player2Hand)) {
    dealerStatusElement.textContent = 'Win';
    dealerWins++;
  } else if (player1Total === dealerTotal && player2Total === dealerTotal) {
    player1StatusElement.textContent = 'Draw';
    player2StatusElement.textContent = 'Draw';
    dealerStatusElement.textContent = 'Draw';
    dealerDraws++;
  } else if (player1Total > dealerTotal && player1Total <= 21) {
    player1StatusElement.textContent = 'Win';
    player2StatusElement.textContent = 'Lose';
    dealerStatusElement.textContent = 'Lose';
    player1Wins++;
    player2Losses++;
    dealerLosses++;
  } else if (player2Total > dealerTotal && player2Total <= 21) {
    player1StatusElement.textContent = 'Lose';
    player2StatusElement.textContent = 'Win';
    dealerStatusElement.textContent = 'Lose';
    player1Losses++;
    player2Wins++;
    dealerLosses++;
  } else if (dealerTotal > 21) {
    player1StatusElement.textContent = 'Win';
    player2StatusElement.textContent = 'Win';
    dealerStatusElement.textContent = 'Bust';
    dealerLosses++;
  } else {
    player1StatusElement.textContent = 'Lose';
    player2StatusElement.textContent = 'Lose';
    dealerStatusElement.textContent = 'Win';
    dealerWins++;
    player1Losses++;
    player2Losses++;
  }

  updateScoreboard();
}


// Update scoreboard
function updateScoreboard() {
  document.querySelector('#dealerWins').textContent = dealerWins;
  document.querySelector('#dealerLosses').textContent = dealerLosses;
  document.querySelector('#dealerDraws').textContent = dealerDraws;
  document.querySelector('#player1Wins').textContent = player1Wins;
  document.querySelector('#player1Losses').textContent = player1Losses;
  document.querySelector('#player1Draws').textContent = player1Draws;
  document.querySelector('#player2Wins').textContent = player2Wins;
  document.querySelector('#player2Losses').textContent = player2Losses;
  document.querySelector('#player2Draws').textContent = player2Draws;
}

// Deal initial cards
function dealInitialCards() {
  // Clear existing hands
  dealerHand = [];
  player1Hand = [];
  player2Hand = [];
  player1Stood = false;
  player2Stood = false;
  dealerStood = false;

  // Deal 2 cards to each player and dealer
  for (let i = 0; i < 2; i++) {
    dealCard(player1Hand);
    dealCard(player2Hand);
    dealCard(dealerHand);
  }

  disableButtons();
  enablePlayerButtons();

  updateUI();
  displayTotal();
}

// Check the status of the game
function checkStatus() {
  if (isAllStandClicked()) {
    determineStatus();
    disableButtons();
  }
}

// Handle Hit button click for Player 1
function player1Hit() {
  const card = dealCard(player1Hand);

  if (isBust(player1Hand)) {
    disableButtons();
    player1Stood = true;
    checkStatus();
  }

  updateUI();
  displayTotal();
}

// Handle Hit button click for Player 2
function player2Hit() {
  const card = dealCard(player2Hand);

  if (isBust(player2Hand)) {
    disableButtons();
    player2Stood = true;
    checkStatus();
  }

  updateUI();
  displayTotal();
}

// Handle Hit button click for Dealer
function dealerHit() {
  const card = dealCard(dealerHand);

  if (isBust(dealerHand)) {
    disableButtons();
    dealerStood = true;
    checkStatus();
  }

  updateUI();
  displayTotal();
}

// Handle Stand button click for Player 1
function player1Stand() {
  p1HitBtn.disabled = true;
  p1StandBtn.disabled = true;
  player1Stood = true;
  checkStatus();
}

// Handle Stand button click for Player 2
function player2Stand() {
  p2HitBtn.disabled = true;
  p2StandBtn.disabled = true;
  player2Stood = true;
  checkStatus();
}

// Handle Stand button click for Dealer
function dealerStand() {
  dealerStandBtn.disabled = true;
  hitBtn.disabled = true;
  dealerStood = true;
  checkStatus();
}

// Handle Next Game button click
function nextGame() {
  deck = [...DECK];
  dealerHand = [];
  player1Hand = [];
  player2Hand = [];
  player1Stood = false;
  player2Stood = false;
  dealerStood = false;

  enableDealButton();

  updateUI();
  displayTotal();
  resetStatus();
}

// Reset the status display
function resetStatus() {
  player1StatusElement.textContent = '';
  player2StatusElement.textContent = '';
  dealerStatusElement.textContent = '';
}

// Event listeners
dealBtn.addEventListener('click', function () {
  dealInitialCards();
  dealBtn.disabled = true;
});
hitBtn.removeEventListener('click', dealerHit);
hitBtn.addEventListener('click', player1Hit);
p1HitBtn.addEventListener('click', player1Hit);
p2HitBtn.addEventListener('click', player2Hit);
dealerStandBtn.addEventListener('click', dealerStand);
nextBtn.addEventListener('click', nextGame);
p1StandBtn.addEventListener('click', player1Stand);
p2StandBtn.addEventListener('click', player2Stand);

// Initialize the deck
deck = [...DECK];

// Disable buttons initially
disableButtons();
