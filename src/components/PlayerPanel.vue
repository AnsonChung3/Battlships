<template>
    <div>
        <h2>Player Panel</h2>
        <!-- clear grid / auto grid / confirm grid -->
        <div>
            <custom-q-btn
                @click="clearGrid"
                labelText="clear Grid"
            />
            <custom-q-btn
                @click="autoGrid"
                label="auto place"
            />
            <custom-q-btn
                @click="confirmGrid"
                label="confirm Grid"
            />
        </div>
        <q-separator dark spaced/>
        <!-- auto placement for individual ships -->
        <p>
            Click the below numbers to auto place individual ships.<br>
            *Direction of placement is random.
        </p>
        <div>
            <custom-q-btn
                v-for="(len, i) in shipLengthArray" :key="i"
                @click="shipPlacement(len)"
                :labelText=len
                class="buttonRow"
            />
        </div>
        <q-separator dark spaced/>
        <!-- mannual placement -->
        <div v-if="!gridConfirmed">
            <p>Pick the size of ship you want to place</p>
            <p>Direction of placement : {{ mannualDirection }}</p>
            <custom-q-btn
                @click="rotate"
                label="Rotate"
                class="buttonRow"
            />
            <custom-q-btn
                v-for="(len, i) in shipLengthArray" :key="i"
                @click="mannualLength = len"
                :label=len
                class="buttonRow"
            />
        </div>
        <!-- play area -->
        <div v-for="(row, R) in gridArray" :key="R">
            <div class="inline" v-for="(cell, C) in row" :key="C">
                <!-- set up v-if/else block for click logic
                    v-if (confirmedGrid) { cell@click="checkHit" }
                    v-else {cell@click="doPlacement"}
                -->
                <div
                    v-if="!gridConfirmed"
                    @click="doPlacement({R, C}, mannualLength, mannualPlaceRight)"
                    class="cell"
                    :style="{background: '#'+cellColor(cell.state)}"
                >
                    <!-- {{ [R, C] }} -->
                    <!-- {{ cell.state }} -->
                </div>
                <div
                    v-else
                    @click="isHit({R, C})"
                    class="cell"
                    :style="{background: '#'+cellColor(cell.state)}"
                >
                    <!-- {{ cell.state }} -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CustomQBtn from 'src/components/CustomQBtn.vue';

const mannualPlaceRight = ref(true);
const mannualDirection = computed(() => mannualPlaceRight.value ? 'Right' : 'Down');
function rotate () {
    mannualPlaceRight.value = !mannualPlaceRight.value;
}
const mannualLength = ref(0);

// this blcok is to generate an empty grid
const gridWidth = 10;
const gridArray = ref([]);
const shipLengthArray = ref([5, 4, 3, 3, 2, 2, 1, 1]);
function generateGrid () {
    for (let R = 0; R < gridWidth; R++) {
        const rowArray = [];
        for (let C = 0; C < gridWidth; C++) {
            rowArray.push({ coordinate: `row ${R}, column ${C}`, state: 0 });
        }
        gridArray.value.push(rowArray);
    }
}
generateGrid();
function clearGrid () {
    gridArray.value.forEach(row => row.forEach(cell => { cell.state = 0; }));
}

// first get a random start point
function getRandom (max) {
    return Math.floor(Math.random() * max);
}
// reutrning an object e.g. {R: 1, C: 1}
function getRndStart (shipLength) {
    const maxStartArea = gridWidth - shipLength;
    let R = getRandom(gridWidth);
    let C = getRandom(gridWidth);
    let randomCell = gridArray.value[R][C];

    // while (cell is unavailable OR not enough space for neither placement direction) is true
    // {get a new random start}
    while (randomCell.state !== 0 || (R > maxStartArea && C > maxStartArea)) {
        R = getRandom(gridWidth);
        C = getRandom(gridWidth);
        randomCell = gridArray.value[R][C];
    }
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
    const R = coordinate.R;
    const C = coordinate.C;
    for (let i = 0; i < shipLength; i++) {
        if (goRight) {
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
    // e.g. startCell = {R: 1, C: 2}
    let startCell = getRndStart(shipLength);
    if (shipLength === 1) {
        doPlacement(startCell, shipLength, true);
        return;
    }
    let right = placeRightSuccess(startCell, shipLength);
    let down = placeDownSuccess(startCell, shipLength);
    // right and left are boolean values
    // while (the start cell is available, but it is blocked in both direction) is ture
    // {get a new random start and check if any direction is viable}
    while (!right && !down) {
        startCell = getRndStart(shipLength);
        right = placeRightSuccess(startCell, shipLength);
        down = placeDownSuccess(startCell, shipLength);
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

function autoGrid () {
    shipLengthArray.value.forEach(len => shipPlacement(len));
}

const gridConfirmed = ref(false);
const confirmedArray = ref([]);
function confirmGrid () {
    confirmedArray.value = JSON.parse(JSON.stringify(gridArray.value));
    gridConfirmed.value = true;
    clearGrid();
}

function isHit (coordinate) {
    if (confirmedArray.value[coordinate.R][coordinate.C].state === 1) {
        gridArray.value[coordinate.R][coordinate.C].state = 3;
    } else {
        gridArray.value[coordinate.R][coordinate.C].state = 4;
    }
}

// dynamic background color for cells
function cellColor (state) {
    switch (state) {
    case 0:
        // cell is blank
        return '948C15';
    case 1:
        // ship is here
        return '971E1E';
    case 2:
        // empty space between ships, cannot be used
        return '1B4D91';
    case 3:
        // successful hit
        return 'B61A1A';
    case 4:
        // empty hit
        return 'D4D4D4';
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
    width: 40px;
    height: 40px;
    border: 1px solid #D4D4D4;
    margin: -10% -10% -10% 0%
}
.buttonRow {
    margin-bottom: 2%
}
</style>
