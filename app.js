let playerCount = 0; // Variable to keep track of the number of players
let dealerVisible = false; // Flag to indicate if the dealer is visible
let players = []; // Array to store the player objects

const dealer = {
  cards: [] // Object representing the dealer with an empty array to store cards
};

const joinBtn = document.querySelector('#join-btn'); // Selecting the join button element
joinBtn.addEventListener('click', joinGame); // Adding a click event listener to the join button

const resetBtn = document.querySelector('#reset-btn'); // Selecting the reset button element
resetBtn.addEventListener('click', resetGame); // Adding a click event listener to the reset button
resetBtn.addEventListener('click', enableJoinButton); // Adding a click event listener to the reset button to enable the join button

const startBtn = document.querySelector('#start-btn'); // Selecting the start button element
startBtn.addEventListener('click', startGame); // Adding a click event listener to the start button

const dealerContainer = document.querySelector('#dealer-container'); // Selecting the dealer container element
const hitBtn = dealerContainer.querySelector('.hit-btn'); // Selecting the hit button element within the dealer container
const doneBtn = dealerContainer.querySelector('.done-btn'); // Selecting the done button element within the dealer container

hitBtn.addEventListener('click', dealerHit); // Adding a click event listener to the hit button
doneBtn.addEventListener('click', dealerDone); // Adding a click event listener to the done button

const nextGameBtn = document.querySelector('#next-game-btn'); // Selecting the next game button element
nextGameBtn.addEventListener('click', startNextGame); // Adding a click event listener to the next game button
nextGameBtn.disabled = true; // Disabling the next game button initially

function enableJoinButton() {
  joinBtn.disabled = false; // Enable the join button
}

function enableDealerButtons() {
  hitBtn.disabled = false; // Enable the hit button
  doneBtn.disabled = false; // Enable the done button
}

function joinGame() {
  const playerName = prompt('Enter player name:'); // Prompt the user to enter a player name
  if (playerName && playerName.trim() !== '') { // Check if the player name is not empty or consists only of whitespace
    playerCount++; // Increment the player count
    const player = {
      id: playerCount, // Assign a unique ID to the player
      name: playerName,
      balance: 1000, // Starting balance of the player
      bets: 0, // Initial bet amount of the player
      stood: false, // Flag to indicate if the player stood
      stats: { wins: 0, losses: 0, draws: 0 }, // Object to track player's game statistics
      winLossAmount: 0, // Amount won/lost by the player
      cards: [] // Array to store the player's cards
    };
    players.push(player); // Add the player to the players array

    const playerContainer = document.querySelector('#player-container'); // Selecting the player container element
    const playerDiv = createPlayerDiv(player); // Creating a player div element
    playerContainer.appendChild(playerDiv); // Append the player div to the player container

    if (playerCount === 2) {
      joinBtn.disabled = true; // Disable the join button if the maximum number of players is reached
    }

    if (playerCount === 1) {
      startBtn.removeAttribute('disabled'); // Enable the start button if there is at least one player
    }
  }
}

function createPlayerDiv(player) {
  const playerDiv = document.createElement('div');
  playerDiv.id = `player-${player.id}`;
  playerDiv.classList.add('player');
  playerDiv.innerHTML = `
    <p class="player-name">Player ${player.id}: ${player.name}</p>
    <div id="player-${player.id}-balance" class="player-balance">
      Balance: $${player.balance}
    </div>
    <div id="player-${player.id}-bets" class="player-bets">
      BETS: ${player.bets}
    </div>
    <div class="player-cards"></div>
    <div class="player-buttons">
      <button class="hit-btn" onclick="hit(${player.id})" disabled>Hit</button>
      <button class="stand-btn" onclick="stand(${player.id})" disabled>Stand</button>
    </div>
    <div id="player-${player.id}-chips" class="player-chips">
      <button class="chip-btn" onclick="deductChips(${player.id}, 100)">\$100 chips</button>
      <button class="chip-btn" onclick="deductChips(${player.id}, 50)">\$50 chips</button>
      <button class="place-bet-btn" onclick="placeBets(${player.id})" disabled>Place Bet</button>
    </div>
    <div id="player-${player.id}-status" class="player-status"></div>
  `;

  return playerDiv;
}
function deductChips(playerId, amount) {
  const player = players.find(player => player.id === playerId); // Find the player with the specified player ID
  if (player && player.balance >= amount) { // Check if the player exists and has sufficient balance
    player.balance -= amount; // Deduct the bet amount from the player's balance
    player.bets += amount; // Add the bet amount to the player's total bets
    updateBalanceDisplay(playerId); // Update the UI to display the updated player balance
    updateBetsDisplay(playerId); // Update the UI to display the updated player bets

    const playerChipsDiv = document.querySelector(`#player-${playerId}-chips`); // Select the player chips container element
    const chipButtons = playerChipsDiv.querySelectorAll('.chip-btn'); // Select all chip buttons within the player chips container
    chipButtons.forEach(button => {
      button.disabled = true; // Disable all chip buttons
    });

    const placeBetBtn = playerChipsDiv.querySelector('.place-bet-btn'); // Select the place bet button within the player chips container
    placeBetBtn.disabled = false; // Enable the place bet button
  }
}

function updateBalanceDisplay(playerId) {
  const playerBalanceDiv = document.querySelector(`#player-${playerId}-balance`); // Select the player balance display element
  const player = players.find(player => player.id === playerId); // Find the player with the specified player ID
  if (player) {
    playerBalanceDiv.textContent = `Balance: $${player.balance}`; // Update the player balance display with the updated balance
  }
}

function updateBetsDisplay(playerId) {
  const playerBetsDiv = document.querySelector(`#player-${playerId}-bets`); // Select the player bets display element
  const player = players.find(player => player.id === playerId); // Find the player with the specified player ID
  if (player) {
    playerBetsDiv.textContent = `BETS: ${player.bets}`; // Update the player bets display with the updated bets
  }
}

function placeBets(playerId) {
  const player = players.find(player => player.id === playerId); // Find the player with the specified player ID
  if (player) {
    const playerChipsDiv = document.querySelector(`#player-${playerId}-chips`); // Select the player chips container element
    const chipButtons = playerChipsDiv.querySelectorAll('.chip-btn'); // Select all chip buttons within the player chips container
    chipButtons.forEach(button => {
      button.disabled = true; // Disable all chip buttons
    });

    const placeBetBtn = playerChipsDiv.querySelector('.place-bet-btn'); // Select the place bet button within the player chips container
    placeBetBtn.disabled = true; // Disable the place bet button
    player.stood = false; // Reset the stood flag for the player

    const allBetsPlaced = players.every(player => player.bets > 0); // Check if all players have placed their bets
    if (allBetsPlaced) {
      distributeCards(revealCards); // Call revealCards as the callback after the cards are distributed
    }
  }
}

function revealCards() {
  players.forEach(player => {
    const playerDiv = document.querySelector(`#player-${player.id}`); // Select the player div element
    const cardsDiv = playerDiv.querySelector('.player-cards'); // Select the player cards container element
    cardsDiv.style.display = 'block'; // Display the player cards container
  });

  const dealerCardsDiv = dealerContainer.querySelector('.dealer-cards'); // Select the dealer cards container element
  dealerCardsDiv.style.display = 'block'; // Display the dealer cards container
}

function distributeCards(callback) {
  const cards = [
    // List of available cards
  ];

  const shuffledCards = shuffle(cards); // Shuffle the cards

  players.forEach(player => {
    player.cards = shuffledCards.splice(0, 2); // Distribute two cards to each player
  });
  dealer.cards = shuffledCards.splice(0, 2); // Distribute two cards to the dealer

  displayCards(); // Display the distributed cards

  if (typeof callback === 'function') {
    callback(); // Execute the callback function if provided
  }
}
function shuffle(array) {
  const shuffledArray = [...array]; // Create a copy of the array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements to shuffle the array
  }
  return shuffledArray; // Return the shuffled array
}

function displayCards() {
  players.forEach(player => {
    const playerDiv = document.querySelector(`#player-${player.id}`); // Select the player div element
    const cardsDiv = playerDiv.querySelector('.player-cards'); // Select the player cards container element
    if (cardsDiv) {
      cardsDiv.remove(); // Remove the existing cards container if it exists
    }
    const cardsContainer = document.createElement('div'); // Create a new div element for the cards container
    cardsContainer.classList.add('player-cards'); // Add the 'player-cards' class to the container
    const total = calculateCardTotal(player.cards); // Calculate the total value of the player's cards
    cardsContainer.innerHTML = `
      <p>Cards: ${player.cards.join(', ')}</p>
      <p>Total: ${total}</p>
    `; // Set the HTML content of the container to display the player's cards and total
    playerDiv.appendChild(cardsContainer); // Append the cards container to the player div

    cardsContainer.style.display = 'block'; // Show the card container
  });

  const dealerCardsDiv = dealerContainer.querySelector('.dealer-cards'); // Select the dealer cards container element
  if (dealerCardsDiv) {
    dealerCardsDiv.remove(); // Remove the existing dealer cards container if it exists
  }
  const cardsContainer = document.createElement('div'); // Create a new div element for the dealer cards container
  cardsContainer.classList.add('dealer-cards'); // Add the 'dealer-cards' class to the container
  const total = calculateCardTotal(dealer.cards); // Calculate the total value of the dealer's cards
  cardsContainer.innerHTML = `
    <p>Cards: ${dealer.cards[0]}, ??</p>
    <p>Total: ?</p>
  `; // Set the HTML content of the container to display the dealer's cards with one card hidden and the total as unknown
  dealerContainer.appendChild(cardsContainer); // Append the cards container to the dealer container

  cardsContainer.style.display = 'block'; // Show the card container
}

function resetGame() {
  const playerContainer = document.querySelector('#player-container'); // Select the player container element
  while (playerContainer.firstChild) {
    playerContainer.removeChild(playerContainer.firstChild); // Remove all child elements from the player container
  }
  playerCount = 0; // Reset the player count
  dealerVisible = false; // Set the dealer visibility to false
  dealerContainer.style.display = 'none'; // Hide the dealer container
  startBtn.removeAttribute('disabled'); // Enable the start button
  nextGameBtn.disabled = true; // Disable the next game button
  players = []; // Reset the players array
  dealer.cards = []; // Reset the dealer's cards

  const dealerCardsDiv = dealerContainer.querySelector('.dealer-cards'); // Select the dealer cards container element
  if (dealerCardsDiv) {
    dealerCardsDiv.remove(); // Remove the existing dealer cards container if it exists
  }

  const dealerStatusDiv = dealerContainer.querySelector('.player-status'); // Select the dealer status element
  if (dealerStatusDiv) {
    dealerStatusDiv.textContent = ''; // Clear the dealer status text
  }

  joinBtn.disabled = false; // Enable the join button
}

function startGame() {
  if (playerCount > 0) { // Check if there are players in the game
    dealerVisible = true; // Set the dealer visibility to true
    dealerContainer.style.display = 'block'; // Show the dealer container
    startBtn.setAttribute('disabled', 'disabled'); // Disable the start button
    players.forEach(player => {
      const hitBtn = document.querySelector(`#player-${player.id} .hit-btn`); // Select the hit button for the player
      const standBtn = document.querySelector(`#player-${player.id} .stand-btn`); // Select the stand button for the player
      hitBtn.disabled = false; // Enable the hit button
      standBtn.disabled = false; // Enable the stand button
    });

    players.forEach(player => {
      const placeBetBtn = document.querySelector(`#player-${player.id}-chips .place-bet-btn`); // Select the place bet button for the player
      placeBetBtn.disabled = false; // Enable the place bet button
    });

    enableDealerButtons(); // Enable the hit button and done button for the dealer
  }
}
function startNextGame() {
  resetGame(); // Reset the game state
  nextGameBtn.disabled = true; // Disable the next game button

  players.forEach(player => {
    const placeBetBtn = document.querySelector(`#player-${player.id}-chips .place-bet-btn`);
    placeBetBtn.disabled = false; // Enable the place bet button for each player
  });
}

function hit(playerId) {
  const player = players.find(player => player.id === playerId);
  if (player && !player.stood) {
    const cards = [
      // ...
    ];
    const randomCard = cards[Math.floor(Math.random() * cards.length)]; // Choose a random card from the deck
    player.cards.push(randomCard); // Add the card to the player's hand
    const playerDiv = document.querySelector(`#player-${playerId}`);
    const cardsDiv = playerDiv.querySelector('.player-cards');
    const total = calculateCardTotal(player.cards); // Calculate the new total value of the player's hand
    cardsDiv.innerHTML = `
      <p>Cards: ${player.cards.join(', ')}</p>
      <p>Total: ${total}</p>
    `;
    if (total > 21) {
      console.log('Bust!');
      const hitBtn = playerDiv.querySelector('.hit-btn');
      const standBtn = playerDiv.querySelector('.stand-btn');
      hitBtn.disabled = true; // Disable the hit button for the player
      standBtn.disabled = true; // Disable the stand button for the player
      displayPlayerStatus(playerId, 'Lose'); // Display player status as "Lose"
      updateBalance(playerId, 'Lose'); // Update player balance as "Lose"
    }
  }
}

function stand(playerId) {
  const player = players.find(player => player.id === playerId);
  if (player && !player.stood) {
    player.stood = true; // Set the player's stood flag to true
    const hitBtn = document.querySelector(`#player-${playerId} .hit-btn`);
    const standBtn = document.querySelector(`#player-${playerId} .stand-btn`);
    hitBtn.disabled = true; // Disable the hit button for the player
    standBtn.disabled = true; // Disable the stand button for the player

    if (playerId < players.length) {
      const nextPlayerId = playerId + 1;
      const nextPlayerDiv = document.querySelector(`#player-${nextPlayerId}`);
      const nextPlayerHitBtn = nextPlayerDiv.querySelector('.hit-btn');
      const nextPlayerStandBtn = nextPlayerDiv.querySelector('.stand-btn');
      nextPlayerHitBtn.disabled = false; // Enable the hit button for the next player
      nextPlayerStandBtn.disabled = false; // Enable the stand button for the next player
    } else {
      const dealerHitBtn = dealerContainer.querySelector('.hit-btn');
      dealerHitBtn.disabled = false; // Enable the hit button for the dealer
      doneBtn.disabled = false; // Enable the done button for the dealer
    }
  }
}

function dealerHit() {
  const cards = [
    // ...
  ];
  const randomCard = cards[Math.floor(Math.random() * cards.length)]; // Choose a random card from the deck
  dealer.cards.push(randomCard); // Add the card to the dealer's hand
  const cardsDiv = dealerContainer.querySelector('.dealer-cards');
  const total = calculateCardTotal(dealer.cards); // Calculate the new total value of the dealer's hand
  cardsDiv.innerHTML = `
    <p>Cards: ${dealer.cards.join(', ')}</p>
    <p>Total: ${total}</p>
  `;
  if (total > 21) {
    console.log('Dealer bust!');
    const dealerHitBtn = dealerContainer.querySelector('.hit-btn');
    dealerHitBtn.disabled = true; // Disable the hit button for the dealer
    doneBtn.disabled = true; // Disable the done button for the dealer

    players.forEach(player => {
      if (!player.stood) {
        displayPlayerStatus(player.id, 'Win'); // Display player status as "Win"
        updateBalance(player.id, 'Win'); // Update player balance as "Win"
      } else {
        const playerTotal = calculateCardTotal(player.cards);
        if (playerTotal > total) {
          displayPlayerStatus(player.id, 'Win'); // Display player status as "Win"
          updateBalance(player.id, 'Win'); // Update player balance as "Win"
        } else if (playerTotal === total) {
          displayPlayerStatus(player.id, 'Draw'); // Display player status as "Draw"
          updateBalance(player.id, 'Draw'); // Update player balance as "Draw"
        } else {
          displayPlayerStatus(player.id, 'Lose'); // Display player status as "Lose"
          updateBalance(player.id, 'Lose'); // Update player balance as "Lose"
        }
      }
    });

    nextGameBtn.disabled = false; // Enable the next game button
  } else if (total >= 17) {
    dealerDone(); // Proceed with the dealer's turn
  }
}

function dealerDone() {
  const dealerHitBtn = dealerContainer.querySelector('.hit-btn');
  dealerHitBtn.disabled = true; // Disable the hit button for the dealer
  doneBtn.disabled = true; // Disable the done button for the dealer

  players.forEach(player => {
    if (!player.stood) {
      displayPlayerStatus(player.id, 'Win'); // Display player status as "Win"
      updateBalance(player.id, 'Win'); // Update player balance as "Win"
    } else {
      const playerTotal = calculateCardTotal(player.cards);
      if (playerTotal > calculateCardTotal(dealer.cards)) {
        displayPlayerStatus(player.id, 'Win'); // Display player status as "Win"
        updateBalance(player.id, 'Win'); // Update player balance as "Win"
      } else if (playerTotal === calculateCardTotal(dealer.cards)) {
        displayPlayerStatus(player.id, 'Draw'); // Display player status as "Draw"
        updateBalance(player.id, 'Draw'); // Update player balance as "Draw"
      } else {
        displayPlayerStatus(player.id, 'Lose'); // Display player status as "Lose"
        updateBalance(player.id, 'Lose'); // Update player balance as "Lose"
      }
    }
  });

  nextGameBtn.disabled = false; // Enable the next game button
}

function displayPlayerStatus(playerId, status) {
  const playerStatusDiv = document.querySelector(`#player-${playerId}-status`);
  playerStatusDiv.textContent = `Status: ${status}`; // Display the player's status
}

function updateBalance(playerId, result) {
  const player = players.find(player => player.id === playerId);
  if (player) {
    if (result === 'Win') {
      player.balance += player.bets; // Add the bet amount to the player's balance
      player.stats.wins++; // Increment the player's win count
      player.winLossAmount += player.bets; // Update the player's win/loss amount
    } else if (result === 'Lose') {
      player.stats.losses++; // Increment the player's loss count
      player.winLossAmount -= player.bets; // Update the player's win/loss amount
    } else {
      player.balance += player.bets; // Add the bet amount to the player's balance (for a draw)
      player.stats.draws++; // Increment the player's draw count
    }
    updateBalanceDisplay(playerId); // Update the player's balance display
  }
}
function calculateCardTotal(cards) {
  let total = 0;
  let aceCount = 0;
  for (let card of cards) {
    const value = card.substring(card.indexOf(' ') + 1);
    if (value === 'Jack' || value === 'Queen' || value === 'King') {
      total += 10; // For face cards (Jack, Queen, King), add 10 to the total
    } else if (value === 'Ace') {
      total += 11; // For an Ace, add 11 to the total
      aceCount++; // Keep track of the number of Aces in the cards
    } else {
      total += parseInt(value); // For numeric cards, add their respective values to the total
    }
  }
  while (total > 21 && aceCount > 0) {
    total -= 10; // If the total is greater than 21 and there are Aces, consider an Ace as 1 instead of 11
    aceCount--; // Reduce the count of Aces
  }
  return total; // Return the final total
}

function distributeCards(callback) {
  const cards = [
    'Ace A', 'Ace 2', 'Ace 3', 'Ace 4', 'Ace 5', 'Ace 6', 'Ace 7', 'Ace 8', 'Ace 9', 'Ace 10', 'Ace Jack', 'Ace Queen', 'Ace King',
    'Spade A', 'Spade 2', 'Spade 3', 'Spade 4', 'Spade 5', 'Spade 6', 'Spade 7', 'Spade 8', 'Spade 9', 'Spade 10', 'Spade Jack', 'Spade Queen', 'Spade King',
    'Cube A', 'Cube 2', 'Cube 3', 'Cube 4', 'Cube 5', 'Cube 6', 'Cube 7', 'Cube 8', 'Cube 9', 'Cube 10', 'Cube Jack', 'Cube Queen', 'Cube King',
    'Heart A', 'Heart 2', 'Heart 3', 'Heart 4', 'Heart 5', 'Heart 6', 'Heart 7', 'Heart 8', 'Heart 9', 'Heart 10', 'Heart Jack', 'Heart Queen', 'Heart King'
  ];

  const shuffledCards = shuffle(cards); // Shuffle the cards array

  players.forEach(player => {
    player.cards = shuffledCards.splice(0, 2); // Distribute 2 cards to each player from the shuffled cards array
  });
  dealer.cards = shuffledCards.splice(0, 2); // Distribute 2 cards to the dealer from the remaining shuffled cards

  displayCards(); // Display the distributed cards on the game board

  if (typeof callback === 'function') {
    callback(); // If a callback function is provided, execute it
  }
}

function shuffle(array) {
  const shuffledArray = [...array]; // Create a copy of the original array to avoid modifying it directly
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate a random index between 0 and i (inclusive)
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap the elements at indices i and j
  }
  return shuffledArray; // Return the shuffled array
}
function displayCards() {
  players.forEach(player => {
    const playerDiv = document.querySelector(`#player-${player.id}`);
    const cardsDiv = playerDiv.querySelector('.player-cards');
    if (cardsDiv) {
      cardsDiv.remove();
    }
    const cardsContainer = document.createElement('div');
    cardsContainer.classList.add('player-cards');
    const total = calculateCardTotal(player.cards);
    cardsContainer.innerHTML = `
      <p>Cards: ${player.cards.join(', ')}</p>
      <p>Total: ${total}</p>
    `;
    playerDiv.appendChild(cardsContainer);

    cardsContainer.style.display = 'block'; // Show the card container
  });

  const dealerCardsDiv = dealerContainer.querySelector('.dealer-cards');
  if (dealerCardsDiv) {
    dealerCardsDiv.remove();
  }
  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('dealer-cards');
  const total = calculateCardTotal(dealer.cards);
  cardsContainer.innerHTML = `
    <p>Cards: ${dealer.cards.join(', ')}</p>
    <p>Total: ${total}</p>
  `;
  dealerContainer.appendChild(cardsContainer);

  cardsContainer.style.display = 'block'; // Show the card container
}
function resetGame() {
  const playerContainer = document.querySelector('#player-container');

  // Remove all child elements from the player container
  while (playerContainer.firstChild) {
    playerContainer.removeChild(playerContainer.firstChild);
  }

  // Reset game-related variables and states
  playerCount = 0;
  dealerVisible = false;
  dealerContainer.style.display = 'none';
  startBtn.removeAttribute('disabled');
  nextGameBtn.disabled = true;
  players = [];
  dealer.cards = [];

  const dealerCardsDiv = dealerContainer.querySelector('.dealer-cards');
  if (dealerCardsDiv) {
    dealerCardsDiv.remove();
  }

  const dealerStatusDiv = dealerContainer.querySelector('.player-status');
  if (dealerStatusDiv) {
    dealerStatusDiv.textContent = '';
  }

  joinBtn.disabled = false;

  // Distribute cards for the next game
  distributeCards();
}

function startGame() {
  if (playerCount > 0) {
    // If there are players in the game
    dealerVisible = true;
    dealerContainer.style.display = 'block'; // Show the dealer container
    startBtn.setAttribute('disabled', 'disabled'); // Disable the Start button

    // Enable Hit and Stand buttons for each player
    players.forEach(player => {
      const hitBtn = document.querySelector(`#player-${player.id} .hit-btn`);
      const standBtn = document.querySelector(`#player-${player.id} .stand-btn`);
      hitBtn.disabled = false; // Enable Hit button
      standBtn.disabled = false; // Enable Stand button
    });

    const dealerCardsDiv = dealerContainer.querySelector('.dealer-cards');
    if (dealerCardsDiv) {
      dealerCardsDiv.remove(); // Clear existing dealer cards
    }

    // Enable Place Bet buttons for each player
    players.forEach(player => {
      const placeBetBtn = document.querySelector(`#player-${player.id}-chips .place-bet-btn`);
      placeBetBtn.disabled = false; // Re-enable Place Bet button
    });

    enableDealerButtons(); // Enable the hit button and done button for the dealer
  }
}
function startNextGame() {
  resetGame(); // Reset the game state
  nextGameBtn.disabled = true; // Disable the Next Game button

  // Enable Place Bet buttons for each player
  players.forEach(player => {
    const placeBetBtn = document.querySelector(`#player-${player.id}-chips .place-bet-btn`);
    placeBetBtn.disabled = false; // Enable Place Bet button
  });
}

function hit(playerId) {
  const player = players.find(player => player.id === playerId);
  if (player && !player.stood) {
    // If the player exists and has not stood
    const cards = [
      // Array of card values
    ];
    const randomCard = cards[Math.floor(Math.random() * cards.length)]; // Pick a random card
    player.cards.push(randomCard); // Add the card to the player's cards
    const playerDiv = document.querySelector(`#player-${playerId}`);
    const cardsDiv = playerDiv.querySelector('.player-cards');
    const total = calculateCardTotal(player.cards); // Calculate the total value of the player's cards
    cardsDiv.innerHTML = `
      <p>Cards: ${player.cards.join(', ')}</p>
      <p>Total: ${total}</p>
    `; // Update the player's cards display

    if (total > 21) {
      // If the total exceeds 21 (bust)
      console.log('Bust!');
      const hitBtn = playerDiv.querySelector('.hit-btn');
      const standBtn = playerDiv.querySelector('.stand-btn');
      hitBtn.disabled = true; // Disable the Hit button
      standBtn.disabled = true; // Disable the Stand button
      displayPlayerStatus(playerId, 'Lose'); // Update player status to 'Lose'
      updateBalance(playerId, 'Lose'); // Update player balance for loss
    }
  }
}
function stand(playerId) {
  const player = players.find(player => player.id === playerId);
  if (player && !player.stood) {
    // If the player exists and has not stood
    player.stood = true; // Set the player's 'stood' property to true

    const hitBtn = document.querySelector(`#player-${playerId} .hit-btn`);
    const standBtn = document.querySelector(`#player-${playerId} .stand-btn`);
    hitBtn.disabled = true; // Disable the Hit button for the player
    standBtn.disabled = true; // Disable the Stand button for the player

    if (playerId < players.length) {
      // If there are more players
      const nextPlayerId = playerId + 1; // Get the ID of the next player
      const nextPlayerDiv = document.querySelector(`#player-${nextPlayerId}`);
      const nextPlayerHitBtn = nextPlayerDiv.querySelector('.hit-btn');
      const nextPlayerStandBtn = nextPlayerDiv.querySelector('.stand-btn');
      nextPlayerHitBtn.disabled = false; // Enable the Hit button for the next player
      nextPlayerStandBtn.disabled = false; // Enable the Stand button for the next player
    } else {
      // If all players have stood, it's the dealer's turn
      const dealerHitBtn = dealerContainer.querySelector('.hit-btn');
      dealerHitBtn.disabled = false; // Enable the Hit button for the dealer
      doneBtn.disabled = false; // Enable the Done button
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
  dealer.cards.push(randomCard); // Add a random card to the dealer's card array
  const cardsDiv = dealerContainer.querySelector('.dealer-cards'); // Get the container for the dealer's cards
  const total = calculateCardTotal(dealer.cards); // Calculate the total value of the dealer's cards
  cardsDiv.innerHTML = `
    <p>Cards: ${dealer.cards.join(', ')}</p>
    <p>Total: ${total}</p>
  `; // Update the HTML content of the container to display the dealer's cards and the total

  if (total > 21) {
    console.log('Dealer bust!');
    const dealerHitBtn = dealerContainer.querySelector('.hit-btn');
    dealerHitBtn.disabled = true; // Disable the Hit button for the dealer
    doneBtn.disabled = true; // Disable the Done button

    players.forEach(player => {
      if (!player.stood) {
        displayPlayerStatus(player.id, 'Win'); // Set the player's status as 'Win'
        updateBalance(player.id, 'Win'); // Update the player's balance and statistics for a win
      } else {
        const playerTotal = calculateCardTotal(player.cards);
        if (playerTotal > total) {
          displayPlayerStatus(player.id, 'Win'); // Set the player's status as 'Win'
          updateBalance(player.id, 'Win'); // Update the player's balance and statistics for a win
        } else if (playerTotal === total) {
          displayPlayerStatus(player.id, 'Draw'); // Set the player's status as 'Draw'
          updateBalance(player.id, 'Draw'); // Update the player's balance and statistics for a draw
        } else {
          displayPlayerStatus(player.id, 'Lose'); // Set the player's status as 'Lose'
          updateBalance(player.id, 'Lose'); // Update the player's balance and statistics for a loss
        }
      }
    });

    nextGameBtn.disabled = false; // Enable the Next Game button
  } else if (total >= 17) {
    dealerDone(); // If the dealer's total is 17 or higher, proceed to the next step of the dealer's turn
  }
}
function dealerDone() {
  const dealerHitBtn = dealerContainer.querySelector('.hit-btn');
  dealerHitBtn.disabled = true; // Disable the dealer's "Hit" button
  doneBtn.disabled = true; // Disable the "Done" button

  players.forEach(player => {
    if (!player.stood) { // If the player has not stood (chosen to stop taking cards)
      displayPlayerStatus(player.id, 'Win'); // Display the player's status as "Win"
      updateBalance(player.id, 'Win'); // Update the player's balance as a win
    } else {
      const playerTotal = calculateCardTotal(player.cards); // Calculate the total value of the player's cards
      if (playerTotal > calculateCardTotal(dealer.cards)) { // If the player's total is greater than the dealer's total
        displayPlayerStatus(player.id, 'Win'); // Display the player's status as "Win"
        updateBalance(player.id, 'Win'); // Update the player's balance as a win
      } else if (playerTotal === calculateCardTotal(dealer.cards)) { // If the player's total is equal to the dealer's total
        displayPlayerStatus(player.id, 'Draw'); // Display the player's status as "Draw"
        updateBalance(player.id, 'Draw'); // Update the player's balance as a draw
      } else { // If the player's total is less than the dealer's total
        displayPlayerStatus(player.id, 'Lose'); // Display the player's status as "Lose"
        updateBalance(player.id, 'Lose'); // Update the player's balance as a loss
      }
    }
  });

  nextGameBtn.disabled = false; // Enable the "Next Game" button
}
function displayPlayerStatus(playerId, status) {
  const playerStatusDiv = document.querySelector(`#player-${playerId}-status`);
  playerStatusDiv.textContent = `Status: ${status}`; // Update the player's status displayed on the page
}

function updateBalance(playerId, result) {
  const player = players.find(player => player.id === playerId); // Find the player with the specified ID

  if (player) { // If the player is found
    if (result === 'Win') { // If the result is a win
      player.balance += player.bets; // Increase the player's balance by the amount they bet
      player.stats.wins++; // Increment the player's win count
      player.winLossAmount += player.bets; // Increase the player's win-loss amount by the amount they bet
    } else if (result === 'Lose') { // If the result is a loss
      player.stats.losses++; // Increment the player's loss count
      player.winLossAmount -= player.bets; // Decrease the player's win-loss amount by the amount they bet
    } else { // If the result is a draw
      player.balance += player.bets; // Increase the player's balance by the amount they bet
      player.stats.draws++; // Increment the player's draw count
    }

    updateBalanceDisplay(playerId); // Update the player's balance displayed on the page
  }
}
function calculateCardTotal(cards) {
  let total = 0; // Initialize the total card value to 0
  let aceCount = 0; // Initialize the count of Aces to 0

  for (let card of cards) { // Iterate over each card in the cards array
    const value = card.substring(card.indexOf(' ') + 1); // Extract the value of the card (e.g., "Ace", "King", "7")
    
    if (value === 'Jack' || value === 'Queen' || value === 'King') {
      total += 10; // If the card is a Jack, Queen, or King, add 10 to the total
    } else if (value === 'Ace') {
      total += 11; // If the card is an Ace, add 11 to the total
      aceCount++; // Increase the count of Aces
    } else {
      total += parseInt(value); // If the card is a numeric value, parse it as an integer and add it to the total
    }
  }

  while (total > 21 && aceCount > 0) {
    total -= 10; // If the total is greater than 21 and there are Aces, treat the Ace as 1 instead of 11
    aceCount--; // Decrease the count of Aces
  }

  return total; // Return the calculated total card value
}
