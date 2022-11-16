<template>
    <div>
        <h1>{{ sampleText }}</h1>
        <q-btn @click="shipPlacement(5)" label="5" color="primary"/>
        <q-btn @click="shipPlacement(3)" label="3" color="primary"/>
        <q-btn @click="shipPlacement(2)" label="2" color="primary"/>
        <q-btn @click="shipPlacement(1)" label="1" color="primary"/>
        <div v-for="(row, R) in gridArray" :key="R">
            <div class="inline" v-for="(cell, C) in row" :key="C">
                <div
                    class="cell"
                    :style="{background: '#'+cellColor(cell.state)}"
                    @click="cell.state++"
                >
                    {{ [R, C] }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const sampleText = ref(`let's try to break the shipPlacement ( ) down`);

// this blcok is to generate the base grid
const gridWidth = 10;
const gridArray = ref([]);
function generateMap () {
    console.log('start generate map');
    for (let R = 0; R < gridWidth; R++) {
        const rowArray = [];
        for (let C = 0; C < gridWidth; C++) {
            rowArray.push({ coordinate: `row ${R}, column ${C}`, state: 0 });
        }
        gridArray.value.push(rowArray);
    }
    console.log('finish generate map');
}
generateMap();

function getRandom (max) {
    return Math.floor(Math.random() * max);
}
// first get a random start point
// reutrning an object e.g. {R: 1, C: 1}
function getRndStart (shipLength) {
    console.log('get random starting coordinate');
    const maxStartArea = gridWidth - shipLength;
    let R = getRandom(gridWidth);
    let C = getRandom(gridWidth);
    let randomCell = gridArray.value[R][C];

    // while statement to make sure ship wouldn't be off the grid
    // left to right or top to bottom
    while (randomCell.state !== 0 || (R > maxStartArea && C > maxStartArea)) {
        console.log(`coordinate sits in nono zone, coordinate being row ${R}, col ${C}`);
        R = getRandom(gridWidth);
        C = getRandom(gridWidth);
        randomCell = gridArray.value[R][C];
    }
    console.log(`right, let's start at row ${R}, col ${C}`);
    return { R, C };
}

function placeRightSuccess (coordinate, shipLength) {
    for (let len = 1; len < shipLength; len++) {
        const col = coordinate.C + len;
        if (col >= gridWidth) {
            return false;
        }
        const cell = gridArray.value[coordinate.R][col];
        if (cell.state !== 0) {
            return false;
        }
    }
    return true;
}
function placeDownSuccess (coordinate, shipLength) {
    for (let len = 1; len < shipLength; len++) {
        const row = coordinate.R + len;
        if (row >= gridWidth) {
            return false;
        }
        const cell = gridArray.value[row][coordinate.C];
        if (cell.state !== 0) {
            return false;
        }
    }
    return true;
}
function directionRight () {
    // this return a boolean value for ship placement direction
    return (Math.random() < 0.5);
}
function doPlacement (coordinate, shipLength, goRight) {
    console.log('do placement');
    const R = coordinate.R;
    const C = coordinate.C;
    for (let i = 0; i < shipLength; i++) {
        if (goRight) {
            console.log('go right');
            // color the ship itself
            gridArray.value[R][C + i].state = 1;
            // color all 6 blocks on both ends of the ship, if exist
            if (i === 0) {
                // left col
                if (C >= 1) {
                    // left end
                    gridArray.value[R][C - 1].state = 2;
                    // left top
                    if (R >= 1) {
                        gridArray.value[R - 1][C - 1].state = 2;
                    }
                    // left bttom
                    if (R + 1 < gridWidth) {
                        gridArray.value[R + 1][C - 1].state = 2;
                    }
                }
                // right col
                if (C + shipLength < gridWidth) {
                    // right end
                    gridArray.value[R][C + shipLength].state = 2;
                    // right top
                    if (R >= 1) {
                        gridArray.value[R - 1][C + shipLength].state = 2;
                    }
                    // right bottom
                    if (R + 1 < gridWidth) {
                        gridArray.value[R + 1][C + shipLength].state = 2;
                    }
                }
            }
            // if the row above exist
            if (R >= 1) {
                // color the block above the ship
                gridArray.value[R - 1][C + i].state = 2;
            }
            // if bottom row exist
            if (R + 1 < gridWidth) {
                gridArray.value[R + 1][C + i].state = 2;
            }
        } else {
            console.log('go down');
            // color the ship itself
            gridArray.value[R + i][C].state = 1;
            // color all 6 blocks on both ends of the ship, if exist
            if (i === 0) {
                // if top row exist
                if (R >= 1) {
                    gridArray.value[R - 1][C].state = 2;
                    // top left
                    if (C >= 1) {
                        gridArray.value[R - 1][C - 1].state = 2;
                    }
                    // top right
                    if (C + 1 < gridWidth) {
                        gridArray.value[R - 1][C + 1].state = 2;
                    }
                }
                // if bottom row exist
                if (R + shipLength < gridWidth) {
                    gridArray.value[R + shipLength][C].state = 2;
                    // bottom left
                    if (C >= 1) {
                        gridArray.value[R + shipLength][C - 1].state = 2;
                    }
                    // bottom right
                    if (C + 1 < gridWidth) {
                        gridArray.value[R + shipLength][C + 1].state = 2;
                    }
                }
            }
            // left col
            if (C >= 1) {
                gridArray.value[R + i][C - 1].state = 2;
            }
            // right col
            if (C + 1 < gridWidth) {
                gridArray.value[R + i][C + 1].state = 2;
            }
        }
    }
}

function shipPlacement (shipLength) {
    let startCell = getRndStart(shipLength);
    // e.g. startCell = {R: 1, C: 2}
    let right = placeRightSuccess(startCell, shipLength);
    let down = placeDownSuccess(startCell, shipLength);
    // right and left are boolean values
    while (!right && !down) {
        console.log(`too bad, it doesn't fit`);
        // if both right and down placements have failed
        // this start cell should be added to an array to keep track of failed ones
        // and then restart the whole process
        startCell = getRndStart(shipLength);
        right = placeRightSuccess(startCell, shipLength);
        down = placeDownSuccess(startCell, shipLength);
    }
    console.log(`coordinate row ${startCell.R} col ${startCell.C}, right is ${right}, down is ${down}`);
    let goRight = true;
    if (right && down) {
        goRight = directionRight();
    } else if (right) {
        goRight = true;
    } else {
        goRight = false;
    }
    doPlacement(startCell, shipLength, goRight);
}
// function cellColor is to change background color of cells when state changes
function cellColor (state) {
    switch (state) {
    case 0:
        // cell is blank
        return 'E0E76D';
    case 1:
        // ship is here
        return 'CA7070';
    case 2:
        // empty space between ships, cannot be used
        return '6DA1E7';
    }
    return '344152';
}

</script>

<style scoped>
.inline {
  display: inline-block;
}
.cell {
    background: #CA7070;
    width: 50px;
    height: 50px;
    border: 1px solid #D4D4D4
}
</style>
