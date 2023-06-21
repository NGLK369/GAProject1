Blackjack 21 Game
This is a simple implementation of the Blackjack 21 game using HTML, CSS, and JavaScript.

Game Rules
The goal of the game is to have a hand value as close to 21 as possible without exceeding it.
Each card has a value associated with it. Number cards (2-10) have their face value, face cards (J, Q, K) have a value of 10, and the Ace (A) can be counted as 1 or 11.
The game is played between a dealer and two players (Player 1 and Player 2).
At the beginning of each round, two cards are dealt to each player and the dealer.
Players can choose to hit (receive an additional card) or stand (keep their current hand) in order to improve their hand value.
After all players have finished their turn, the dealer reveals their hand and hits until their hand value reaches at least 17.
The game outcome is determined based on the hand values of the players and the dealer according to the following rules:
If a player's hand value exceeds 21, they bust and lose the game.
If the dealer's hand value exceeds 21, they bust and all players win.
If a player's hand value is higher than the dealer's hand value and not exceeding 21, the player wins.
If the dealer's hand value is higher than all players' hand values and not exceeding 21, the dealer wins.
If multiple players have the same hand value as the dealer and not exceeding 21, it is a draw.
How to Play
Open the index.html file in your web browser.
Click the "Deal" button to start a new game.
Each player and the dealer will be dealt two cards.
Player 1 and Player 2 can click the "Hit" button to receive an additional card or the "Stand" button to keep their current hand.
After Player 1 and Player 2 have finished their turns, the dealer will reveal their hand and continue hitting until their hand value reaches at least 17.
The game outcome will be displayed on the screen, indicating whether each player wins, loses, or draws with the dealer.
Click the "Next Game" button to start a new round.
Scoreboard
The scoreboard on the right side of the screen keeps track of the number of wins, losses, and draws for the dealer, Player 1, and Player 2.

Customization
The game's appearance can be customized by modifying the style.css file.

Feel free to modify the code and experiment with different features to enhance the game!

To run the game, simply open the index.html file in your web browser.

Note: This implementation uses the provided code files (app.js, index.html, and style.css) to create the game.