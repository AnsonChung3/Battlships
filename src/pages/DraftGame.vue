<template>
    <div>
        <h1>{{ sampleText }}</h1>
        <q-btn
            @click="shipPlacement"
            label="ship placement"
        />
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
const sampleGridWidth = 5;
// shipLength is hard coded here for development
const testLength = 4;

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

function shipPlacement (shipLength) {
    let R = getRandom(sampleGridWidth);
    let C = getRandom(sampleGridWidth);
    let randomCell = mapArray.value[R][C];

    // while statement to make sure enough space for ship to be placed
    // left to right or top to bottom
    while (
        randomCell.state !== 0 ||
        R > sampleGridWidth - shipLength ||
        C > sampleGridWidth - shipLength
    ) {
        R = getRandom(sampleGridWidth);
        C = getRandom(sampleGridWidth);
        randomCell = mapArray.value[R][C];
    }

    mapArray.value[R][C].state = 1;
    console.log(randomCell);
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
