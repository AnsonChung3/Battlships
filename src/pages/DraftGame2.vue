<template>
    <div>
        <h1>{{ sampleText }}</h1>
        <div v-for="(row, R) in mapArray" :key="R">
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
const mapArray = ref([]);
function generateMap () {
    for (let R = 0; R < gridWidth; R++) {
        const rowArray = [];
        for (let C = 0; C < gridWidth; C++) {
            rowArray.push({ coordinate: `row ${R}, column ${C}`, state: 0 });
        }
        mapArray.value.push(rowArray);
    }
}
generateMap();

// this blcok is to try to place a single 3 cell ship
const testLength = 3;
const maxStartDimension = sampleGridWidth - testLength;
function getRandom (max) {
    return Math.floor(Math.random() * max);
}
// first get a random start point
// reutrning an object e.g. {R: 1, C: 1}
let failedStarts = [];
function getRndStart (shipLength) {
    const maxStartArea = gridWidth - shipLength;
    let R = getRandom(gridWidth);
    let C = getRandom(gridWidth);
    let randomCell = mapArray.value[R][C];
    // due to how JS do comparison and reference issue,
    // this needs to be convert to to compare
    let provedFailed = failedStarts.some((cell) => JSON.stringify(cell) === JSON.stringify({R, C}));

    // while statement to make sure ship wouldn't be off the grid
    // left to right or top to bottom
    while (randomCell.state !== 0 || R > maxStartDimension || C > maxStartDimension || provedFailed) {
        R = getRandom(gridWidth);
        C = getRandom(gridWidth);
        randomCell = mapArray.value[R][C];
    }
    return { R, C };
}

function placeRightSuccess (coordinate, shipLength) {
    for (let len = 1; len < shipLength; len++) {
        const cell = mapArray.value[coordinate.R][coordinate.C + len];
        if (cell.state !== 0) {
            return false;
        }
    }
    return true;
}
function placeDownSuccess (coordinate, shipLength) {
    for (let len = 1; len < shipLength; len++) {
        const cell = mapArray.value[coordinate.R + len][coordinate.C];
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
    for (let i = 0; i < shipLength; i++) {
        if (goRight) {
            mapArray.value[coordinate.R][coordinate.C + i].state = 1;
            // there should be another part of the painting
            // to put down the one space around the ship
        } else {
            mapArray.value[coordinate.R + i][coordinate.C].state = 1;
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
        // if both right and down placements have failed
        // this start cell should be added to an array to keep track of failed ones
        // and then restart the whole process
        failedStarts.push(startCell);
        startCell = getRndStart;
        right = placeRightSuccess(startCell);
        down = placeDownSuccess(startCell);
    }
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
