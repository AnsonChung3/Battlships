# Battleships (Battleships)

This is a portfolio project impletmenting the classic 2-player guessing game.
It's a same-screen 2 player game.

## How does the game play?

Players first choose their fleet formation, then game starts automatically.

While choosing formation, ship placement and the buffer tile around the ship will be colored in red and blue. Once game starts, active player will see their own formation shown as "Your Remaning Fleet" and formation colored in green. Any attacks will be shown in red(successful hit) and grey(missed attack).

A modal will pop up when game ends. Quick start with button.

## Features
1. 2 modes of formation placement: Auto and Manual
2. Auto end turn will give 1.5 second of delay after lauching attack
3. Player can choose their own end turn method, and can change at any time in their turn
4. Clear indication of formation placement and damage situation
5. Tooltip shows ship length when hovering over buttons that represents fleet

## How to run the project
```
$ npm install
$ quasar dev
```