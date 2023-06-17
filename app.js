let playerCount = 0;
let dealerVisible = false;
let players = [];
let dealerStats = {
  wins: 0,
  losses: 0,
  draws: 0
};

const dealer = {
  cards: []
};

const joinBtn = document.getElementById('join-btn');
joinBtn.addEventListener('click', joinGame);

const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', resetGame);

const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', startGame);

const dealerContainer = document.getElementById('dealer-container');
const hitBtn = dealerContainer.querySelector('.hit-btn');
const doneBtn = dealerContainer.querySelector('.done-btn');

hitBtn.addEventListener('click', dealerHit);
doneBtn.addEventListener('click', dealerDone);

const nextGameBtn = document.getElementById('next-game-btn');
nextGameBtn.addEventListener('click', startNextGame);
nextGameBtn.disabled = true;

function joinGame() {
  const playerName = prompt('Enter player name:');
  if (playerName !== null && playerName.trim() !== '') {
    playerCount++;
    const player = {
      id: playerCount,
      name: playerName,
      balance: 1000,
      bets: 0,
      stood: false,
      winLossAmount: 0, // Added property for win/loss amount
      stats: {
        wins: 0,
        losses: 0,
        draws: 0
      }
    };
    players.push(player);

    const playerContainer = document.getElementById('player-container');
    const playerDiv = document.createElement('div');
    playerDiv.id = `player-${playerCount}`;
    playerDiv.classList.add('player');
    playerDiv.innerHTML = `
      <p class="player-name">Player ${playerCount}: ${playerName}</p>
      <div id="player-${playerCount}-balance" class="player-balance">
        Balance: $${player.balance}
      </div>
      <div id="player-${playerCount}-bets" class="player-bets">
        BETS: ${player.bets}
      </div>
      <div class="player-buttons">
        <button class="hit-btn" onclick="hit(${playerCount})">Hit</button>
        <button class="stand-btn" onclick="stand(${playerCount})">Stand</button>
      </div>
      <div id="player-${playerCount}-chips" class="player-chips">
        <button class="chip-btn" onclick="deductChips(${player.id}, 100)">\$100 chips</button>
        <button class="chip-btn" onclick="deductChips(${player.id}, 50)">\$50 chips</button>
        <button class="place-bet-btn" onclick="placeBets(${player.id})">Place Bet</button>
      </div>
      <div id="player-${playerCount}-status" class="player-status"></div>
    `;

    playerContainer.appendChild(playerDiv);

    if (playerCount === 1) {
      startBtn.removeAttribute('disabled');
    }
  }
}

function deductChips(playerId, amount) {
  const player = players.find(player => player.id === playerId);
  if (player && player.balance >= amount) {
    player.balance -= amount;
    player.bets += amount;
    updateBalanceDisplay(playerId);
    updateBetsDisplay(playerId);
  }
}

function updateBalanceDisplay(playerId) {
  const playerBalanceDiv = document.getElementById(`player-${playerId}-balance`);
  const player = players.find(player => player.id === playerId);
  if (player) {
    playerBalanceDiv.textContent = `Balance: $${player.balance}`;
  }
}

function updateBetsDisplay(playerId) {
  const playerBetsDiv = document.getElementById(`player-${playerId}-bets`);
  const player = players.find(player => player.id === playerId);
  if (player) {
    playerBetsDiv.textContent = `BETS: ${player.bets}`;
  }
}

function placeBets(playerId) {
  const player = players.find(player => player.id === playerId);
  if (player) {
    const playerChipsDiv = document.getElementById(`player-${playerId}-chips`);
    const chipButtons = playerChipsDiv.querySelectorAll('.chip-btn');
    chipButtons.forEach(button => {
      button.disabled = true;
    });
    const placeBetBtn = playerChipsDiv.querySelector('.place-bet-btn');
    placeBetBtn.disabled = true;
  }

  // Check if all players have placed their bets
  const allBetsPlaced = players.every(player => player.bets > 0);
  if (allBetsPlaced) {
    // Distribute cards
    distributeCards();

    // Start the game
    startGame();
  }
}

function distributeCards() {
  // Create an array of all possible cards
  const cards = [
    'Ace A', 'Ace 2', 'Ace 3', 'Ace 4', 'Ace 5', 'Ace 6', 'Ace 7', 'Ace 8', 'Ace 9', 'Ace 10', 'Ace Jack', 'Ace Queen', 'Ace King',
    'Spade A', 'Spade 2', 'Spade 3', 'Spade 4', 'Spade 5', 'Spade 6', 'Spade 7', 'Spade 8', 'Spade 9', 'Spade 10', 'Spade Jack', 'Spade Queen', 'Spade King',
    'Cube A', 'Cube 2', 'Cube 3', 'Cube 4', 'Cube 5', 'Cube 6', 'Cube 7', 'Cube 8', 'Cube 9', 'Cube 10', 'Cube Jack', 'Cube Queen', 'Cube King',
    'Heart A', 'Heart 2', 'Heart 3', 'Heart 4', 'Heart 5', 'Heart 6', 'Heart 7', 'Heart 8', 'Heart 9', 'Heart 10', 'Heart Jack', 'Heart Queen', 'Heart King'
  ];

  // Shuffle the cards
  const shuffledCards = shuffle(cards);

  // Distribute 2 cards to each player and the dealer
  players.forEach(player => {
    player.cards = shuffledCards.splice(0, 2);
  });
  dealer.cards = shuffledCards.splice(0, 2);

  // Update the UI to display the cards
  displayCards();
}

function shuffle(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function displayCards() {
  // Display player cards and total
  players.forEach(player => {
    const playerDiv = document.getElementById(`player-${player.id}`);
    const cardsDiv = document.createElement('div');
    cardsDiv.classList.add('player-cards');
    const total = calculateCardTotal(player.cards);
    cardsDiv.innerHTML = `
      <p>Cards: ${player.cards.join(', ')}</p>
      <p>Total: ${total}</p>
    `;
    playerDiv.appendChild(cardsDiv);
  });

  // Display dealer cards and total
  const dealerDiv = document.getElementById('dealer-container');
  const cardsDiv = document.createElement('div');
  cardsDiv.classList.add('dealer-cards');
  const total = calculateCardTotal(dealer.cards);
  cardsDiv.innerHTML = `
    <p>Cards: ${dealer.cards.join(', ')}</p>
    <p>Total: ${total}</p>
  `;
  dealerDiv.appendChild(cardsDiv);
}

function resetGame() {
    const playerContainer = document.getElementById('player-container');
    while (playerContainer.firstChild) {
      playerContainer.removeChild(playerContainer.firstChild);
    }
    playerCount = 0;
    dealerVisible = false;
    dealerContainer.style.display = 'none';
    startBtn.removeAttribute('disabled');
    nextGameBtn.disabled = true;
    players = [];
    dealer.cards = [];
  
    const dealerCardsDiv = dealerContainer.querySelector('.dealer-cards');
    if (dealerCardsDiv) {
      dealerCardsDiv.parentNode.removeChild(dealerCardsDiv);
    }
  
    // Clear player stats
    players.forEach(player => {
      player.stats.wins = 0;
      player.stats.losses = 0;
      player.stats.draws = 0;
      player.bets = 0;
    });
    // Clear dealer stats
    dealerStats.wins = 0;
    dealerStats.losses = 0;
    dealerStats.draws = 0;
  
    // Update scoreboard
    updateScoreboard();
  
    // Start a new game
    startGame();
  }
  

function startGame() {
  if (playerCount > 0) {
    dealerVisible = true;
    dealerContainer.style.display = 'block';
    startBtn.setAttribute('disabled', 'disabled');
  }
}

function startNextGame() {
  resetGame();
  nextGameBtn.disabled = true;
}

function hit(playerId) {
  const player = players.find(player => player.id === playerId);
  if (player && !player.stood) {
    const cards = [
      'Ace A', 'Ace 2', 'Ace 3', 'Ace 4', 'Ace 5', 'Ace 6', 'Ace 7', 'Ace 8', 'Ace 9', 'Ace 10', 'Ace Jack', 'Ace Queen', 'Ace King',
      'Spade A', 'Spade 2', 'Spade 3', 'Spade 4', 'Spade 5', 'Spade 6', 'Spade 7', 'Spade 8', 'Spade 9', 'Spade 10', 'Spade Jack', 'Spade Queen', 'Spade King',
      'Cube A', 'Cube 2', 'Cube 3', 'Cube 4', 'Cube 5', 'Cube 6', 'Cube 7', 'Cube 8', 'Cube 9', 'Cube 10', 'Cube Jack', 'Cube Queen', 'Cube King',
      'Heart A', 'Heart 2', 'Heart 3', 'Heart 4', 'Heart 5', 'Heart 6', 'Heart 7', 'Heart 8', 'Heart 9', 'Heart 10', 'Heart Jack', 'Heart Queen', 'Heart King'
    ];
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    player.cards.push(randomCard);
    const playerDiv = document.getElementById(`player-${playerId}`);
    const cardsDiv = playerDiv.querySelector('.player-cards');
    const total = calculateCardTotal(player.cards);
    cardsDiv.innerHTML = `
      <p>Cards: ${player.cards.join(', ')}</p>
      <p>Total: ${total}</p>
    `;
    if (total > 21) {
      console.log('Bust!');
      const hitBtn = playerDiv.querySelector('.hit-btn');
      const standBtn = playerDiv.querySelector('.stand-btn');
      hitBtn.disabled = true;
      standBtn.disabled = true;
      displayPlayerStatus(playerId, 'Lose');
      updateBalance(playerId, 'Lose');
    }
  }
}

function stand(playerId) {
  const player = players.find(player => player.id === playerId);
  if (player && !player.stood) {
    player.stood = true;
    const hitBtn = document.getElementById(`player-${playerId}`).querySelector('.hit-btn');
    const standBtn = document.getElementById(`player-${playerId}`).querySelector('.stand-btn');
    hitBtn.disabled = true;
    standBtn.disabled = true;

    // Proceed to the next player or dealer's turn
    if (playerId < players.length) {
      // Move to the next player
      const nextPlayerId = playerId + 1;
      const nextPlayerDiv = document.getElementById(`player-${nextPlayerId}`);
      const nextPlayerHitBtn = nextPlayerDiv.querySelector('.hit-btn');
      const nextPlayerStandBtn = nextPlayerDiv.querySelector('.stand-btn');
      nextPlayerHitBtn.disabled = false;
      nextPlayerStandBtn.disabled = false;
    } else {
      // All players have stood, proceed to the dealer's turn
      const dealerHitBtn = dealerContainer.querySelector('.hit-btn');
      dealerHitBtn.disabled = false;
      doneBtn.disabled = false;
    }
  }
}

function dealerHit() {
  const cards = [
    'Ace A', 'Ace 2', 'Ace 3', 'Ace 4', 'Ace 5', 'Ace 6', 'Ace 7', 'Ace 8', 'Ace 9', 'Ace 10', 'Ace Jack', 'Ace Queen', 'Ace King',
    'Spade A', 'Spade 2', 'Spade 3', 'Spade 4', 'Spade 5', 'Spade 6', 'Spade 7', 'Spade 8', 'Spade 9', 'Spade 10', 'Spade Jack', 'Spade Queen', 'Spade King',
    'Cube A', 'Cube 2', 'Cube 3', 'Cube 4', 'Cube 5', 'Cube 6', 'Cube 7', 'Cube 8', 'Cube 9', 'Cube 10', 'Cube Jack', 'Cube Queen', 'Cube King',
    'Heart A', 'Heart 2', 'Heart 3', 'Heart 4', 'Heart 5', 'Heart 6', 'Heart 7', 'Heart 8', 'Heart 9', 'Heart 10', 'Heart Jack', 'Heart Queen', 'Heart King'
  ];
  const randomCard = cards[Math.floor(Math.random() * cards.length)];
  dealer.cards.push(randomCard);
  const dealerDiv = document.getElementById('dealer-container');
  const cardsDiv = dealerDiv.querySelector('.dealer-cards');
  const total = calculateCardTotal(dealer.cards);
  cardsDiv.innerHTML = `
    <p>Cards: ${dealer.cards.join(', ')}</p>
    <p>Total: ${total}</p>
  `;
  if (total > 21) {
    console.log('Dealer Bust!');
    displayPlayerStatus('dealer', 'Win');
    updateBalance('dealer', 'Lose');
  }

  const dealerHitBtn = dealerContainer.querySelector('.hit-btn');
  if (total >= 21) {
    dealerHitBtn.disabled = true;
    doneBtn.disabled = false;
  }
}

function dealerDone() {
  const dealerHitBtn = dealerContainer.querySelector('.hit-btn');
  const dealerDoneBtn = dealerContainer.querySelector('.done-btn');
  dealerHitBtn.disabled = true;
  dealerDoneBtn.disabled = true;

  // Disable hit and stand buttons for all players
  players.forEach(player => {
    const playerDiv = document.getElementById(`player-${player.id}`);
    const hitBtn = playerDiv.querySelector('.hit-btn');
    const standBtn = playerDiv.querySelector('.stand-btn');
    hitBtn.disabled = true;
    standBtn.disabled = true;
  });

  // Determine the results
  determineResults();
  updateScoreboard();

  // Enable next game button
  nextGameBtn.disabled = false;
}

function determineResults() {
    const dealerTotal = calculateCardTotal(dealer.cards);
  
    players.forEach(player => {
      const playerDiv = document.getElementById(`player-${player.id}`);
      const playerTotal = calculateCardTotal(player.cards);
      let result;
  
      if (playerTotal > 21 || (dealerTotal <= 21 && dealerTotal > playerTotal)) {
        result = 'Lose';
        player.stats.losses++;
        // Deduct the bet amount from the player's balance if they lose
        player.balance -= player.bets;
      } else if (playerTotal === dealerTotal) {
        result = 'Draw';
        player.stats.draws++;
        // Return the bet amount to the player's balance in case of a draw
        player.balance += player.bets;
      } else {
        result = 'Win';
        player.stats.wins++;
        // Double the bet amount and add it to the player's balance in case of a win
        player.balance += player.bets * 2;
      }
  
      displayPlayerStatus(player.id, result);
      updateBalanceDisplay(player.id); // Update the displayed balance
    });
  
    const dealerResult = getDealerResult(dealerTotal);
    displayPlayerStatus('dealer-container', dealerResult);
  
    if (dealerResult === 'Win') {
      dealerStats.wins++;
    } else if (dealerResult === 'Lose') {
      dealerStats.losses++;
    } else if (dealerResult === 'Draw') {
      dealerStats.draws++;
    }
  
    updateBalanceDisplay('dealer-container'); // Update the displayed balance for the dealer
  }
  

function getDealerResult(total) {
  if (total > 21) {
    return 'Bust';
  } else if (total === 21) {
    return 'Win';
  } else {
    return 'Lose';
  }
}

function displayPlayerStatus(playerId, status) {
  const playerStatusDiv = document.getElementById(`player-${playerId}-status`);
  if (playerStatusDiv) {
    if (playerId === 'dealer-container') {
      playerStatusDiv.textContent = `Dealer: ${status}`;
    } else {
      playerStatusDiv.textContent = status;
    }
  }
}

function calculateCardTotal(cards) {
  let total = 0;
  let acesCount = 0;
  for (const card of cards) {
    const value = getCardValue(card);
    total += value;
    if (value === 1) {
      acesCount++;
    }
  }
  while (total <= 11 && acesCount > 0) {
    total += 10;
    acesCount--;
  }
  return total;
}

function getCardValue(card) {
  const value = card.split(' ')[1];
  if (value === 'Ace' || value === 'Jack' || value === 'Queen' || value === 'King') {
    return 10;
  } else if (value === 'A') {
    return 1;
  } else {
    return parseInt(value);
  }
}

function updateBalance(playerId, result) {
  const player = players.find(player => player.id === playerId);
  if (player) {
    if (result === 'Win') {
      player.balance += player.bets;
    } else if (result === 'Lose') {
      player.balance -= player.bets;
    }
    player.bets = 0;
    updateBalanceDisplay(playerId);
    updateBetsDisplay(playerId);
  }
}

function initScoreboard() {
  const scoreboardContainer = document.getElementById('scoreboard-container');
  scoreboardContainer.innerHTML = `
    <table id="scoreboard">
      <caption>Scoreboard</caption>
      <thead>
        <tr>
          <th>Player</th>
          <th>Wins</th>
          <th>Losses</th>
          <th>Draws</th>
        </tr>
      </thead>
      <tbody id="scoreboard-body">
        <tr id="dealer-score">
          <td>Dealer</td>
          <td id="dealer-wins">0</td>
          <td id="dealer-losses">0</td>
          <td id="dealer-draws">0</td>
        </tr>
      </tbody>
    </table>
    <button id="reset-stats-btn">Reset Statistics</button>
  `;

  players.forEach((player, index) => {
    const scoreboardBody = document.getElementById('scoreboard-body');
    const playerRow = document.createElement('tr');
    playerRow.innerHTML = `
      <td>Player ${index + 1}: ${player.name}</td>
      <td id="player${index + 1}-wins">0</td>
      <td id="player${index + 1}-losses">0</td>
      <td id="player${index + 1}-draws">0</td>
    `;
    scoreboardBody.appendChild(playerRow);
  });

  const resetStatsBtn = document.getElementById('reset-stats-btn');
  resetStatsBtn.addEventListener('click', resetStatistics);
}

function resetStatistics() {
  players.forEach((player, index) => {
    player.stats.wins = 0;
    player.stats.losses = 0;
    player.stats.draws = 0;
  });
  dealerStats.wins = 0;
  dealerStats.losses = 0;
  dealerStats.draws = 0;
  updateScoreboard();
}

initScoreboard();
