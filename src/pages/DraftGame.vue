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

const sampleText = ref('Battleship draft game');
// const gridWidth = 10;
const sampleGridWidth = 5;
const testLength = 3;
const maxStartDimension = sampleGridWidth - testLength;

const mapArray = ref([]);
function generateMap () {
    for (let R = 0; R < sampleGridWidth; R++) {
        const rowArray = [];
        for (let C = 0; C < sampleGridWidth; C++) {
            rowArray.push({ coordinate: `row ${R}, column ${C}`, state: 0 });
        }
        mapArray.value.push(rowArray);
    }
}
generateMap();

function getRandom (max) {
    return Math.floor(Math.random() * max);
}

function doPlacement (R, C, shipLength, direction) {
    // in reality, no cell should be painted until this part
    // so the starting cell is painted here
    for (let i = 0; i < shipLength; i++) {
        if (direction === 'Right') {
            mapArray.value[R][C + i].state = 1;
            // there should be another part of the painting
            // to put down the one space around the ship
        } else {
            mapArray.value[R + i][C].state = 1;
        }
    }
}

function shipPlacement (shipLength) {
    // const maxStartDimention = gridWidth - shipLength;
    let R = getRandom(sampleGridWidth);
    let C = getRandom(sampleGridWidth);
    let randomCell = mapArray.value[R][C];

    // while statement to make sure enough space for ship to be placed
    // left to right or top to bottom
    while (randomCell.state !== 0 || R > maxStartDimension || C > maxStartDimension) {
        R = getRandom(sampleGridWidth);
        C = getRandom(sampleGridWidth);
        randomCell = mapArray.value[R][C];
    }

    // this is display for development
    console.log(`starting coordinate be: ${mapArray.value[R][C].coordinate}`);
    mapArray.value[R][C].state = 1;

    // no extra variation needed if it's a single cell ship
    // if (shipLength === 1) {
    //     doPlacement(shipLength);
    // }

    const direction = Math.random() < 0.5 ? 'Right' : 'Down';
    console.log(`ship is going ${direction}`);
    const placementArray = [];
    for (let len = 1; len < shipLength; len++) {
        if (direction === 'Right') {
            const cell = mapArray.value[R][C + len];
            placementArray.push(cell.state);
        } else {
            const cell = mapArray.value[R + len][C];
            placementArray.push(cell.state);
        }
    }
    // console.log(placementArray);
    if (placementArray.every((cellState) => cellState === 0)) {
        console.log('all blocks are available');
        doPlacement(R, C, shipLength, direction);
    } else {
        console.log('some cell is blocked, need to figure out how to start over');
    }
}

shipPlacement(testLength);

// function cellColor is to change background color of cells when state changes
function cellColor (state) {
    switch (state) {
    case 0:
        return 'E0E76D';
    case 1:
        return 'CA7070';
    case 2:
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
