import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const STATES = store.STATES;
const WIDTH = store.gridWidth;
const activePlayer = store.p1Active ? store.p1 : store.p2;

export function doPlacement (R, C, shipLength, goRight, ID) {
    for (let i = 0; i < shipLength; i++) {
        if (goRight) {
            colorShip(R, C + i, ID);
            // color left/right end of ship once
            if (i === 0) {
                // left end, top, bottm
                if (C >= 1) {
                    colorMargin(R, C - 1);
                    if (R >= 1) {
                        colorMargin(R - 1, C - 1);
                    }
                    if (R + 1 < WIDTH) {
                        colorMargin(R + 1, C - 1);
                    }
                }
                // right end, top, bottm
                if (C + shipLength < WIDTH) {
                    colorMargin(R, C + shipLength);
                    if (R >= 1) {
                        colorMargin(R - 1, C + shipLength);
                    }
                    if (R + 1 < WIDTH) {
                        colorMargin(R + 1, C + shipLength);
                    }
                }
            }
            // if the row above exist, color cell above
            if (R >= 1) {
                colorMargin(R - 1, C + i);
            }
            // if bottom row existm coloe cell below
            if (R + 1 < WIDTH) {
                colorMargin(R + 1, C + i);
            }
        } else {
            colorShip(R + i, C, ID);
            // color top/bottom ends once
            if (i === 0) {
                // top end, left, right
                if (R >= 1) {
                    colorMargin(R - 1, C);
                    if (C >= 1) {
                        colorMargin(R - 1, C - 1);
                    }
                    if (C + 1 < WIDTH) {
                        colorMargin(R - 1, C + 1);
                    }
                }
                // bottom end, left, right
                if (R + shipLength < WIDTH) {
                    colorMargin(R + shipLength, C);
                    if (C >= 1) {
                        colorMargin(R + shipLength, C - 1);
                    }
                    if (C + 1 < WIDTH) {
                        colorMargin(R + shipLength, C + 1);
                    }
                }
            }
            // left col
            if (C >= 1) {
                colorMargin(R + i, C - 1);
            }
            // right col
            if (C + 1 < WIDTH) {
                colorMargin(R + i, C + 1);
            }
        }
    }
}
export function placeRightSuccess (R, C, shipLength) {
    for (let len = 1; len < shipLength; len++) {
        const col = C + len;
        if (col >= WIDTH) {
            return false;
        }
        const cell = activePlayer.grid[R][col];
        if (cell.placement !== STATES.BLANK) {
            return false;
        }
    }
    return true;
}
export function placeDownSuccess (R, C, shipLength) {
    for (let len = 1; len < shipLength; len++) {
        const row = R + len;
        if (row >= WIDTH) {
            return false;
        }
        const cell = activePlayer.grid[row][C];
        if (cell.placement !== STATES.BLANK) {
            return false;
        }
    }
    return true;
}
function colorShip (R, C, ID) {
    activePlayer.grid[R][C].display = STATES.PLACED;
    activePlayer.grid[R][C].placement = STATES.PLACED;
    activePlayer.grid[R][C].ID = ID;
}
function colorMargin (R, C) {
    activePlayer.grid[R][C].display = STATES.MARGIN;
    activePlayer.grid[R][C].placement = STATES.MARGIN;
}
