<template>
    <div class="battleship-top-css">
        <h2>Player Panel</h2>
        <q-card v-if="!gridConfirmed">
            <!-- add watcher for tab switching, clear placements when switching -->
            <q-tabs
                v-model="tab"
                active-color="bg-negative"
                class="bg-primary text-secondary"
                dense
            >
                <q-tab name="auto"     label="Auto" />
                <q-tab name="manual"   label="Manual" />
            </q-tabs>
            <q-tab-panels
                v-model="tab"
                class="bg-info"
            >
                <q-tab-panel name="auto">
                    <div class="bg-info text-secondary">
                        <p>Press button to auto place all ships.</p>
                        <custom-q-btn
                            @click="autoPlace"
                            label="Auto Place"
                        />
                    </div>
                </q-tab-panel>
                <q-tab-panel name="manual">
                    <div class="bg-info text-secondary">
                        <p>Pick the size of ship you want to place</p>
                        <custom-q-btn
                            v-for="(len, i) in shipLengths" :key="i"
                            @click="manualLength = len"
                            :label=len
                            class="buttonRow"
                        />
                        <p>
                            Click to rotate:
                            <custom-q-btn
                                @click="rotate"
                                :label=manualDirectionDisplay
                                class="buttonRow"
                            />
                        </p>
                    </div>
                </q-tab-panel>
            </q-tab-panels>
        </q-card>
        <div>
            <custom-q-btn
                @click="generateGrid"
                label="Clear Placement"
            />
            <custom-q-btn
                :disabled=!isFullPlacement
                @click="confirmPlacement"
                label="Confirm Placement"
            />
        </div>
        <!-- play area -->
        <div v-for="(row, R) in gridArray" :key="R">
            <div class="inline" v-for="(cell, C) in row" :key="C">
                <div
                    v-if="tab==='manual'"
                    @click="manualValidation({R, C}, manualLength, manualPlaceRight)"
                    class="cell"
                    @mouseover="hoverState(R, C)"
                    :style="{background: '#'+cellColor(cell.displayState)}"
                >
                </div>
                <div
                    v-else-if="!gridConfirmed"
                    class="cell"
                    :style="{background: '#'+cellColor(cell.displayState)}"
                >
                </div>
                <div
                    v-else
                    @click="isHit({R, C})"
                    class="cell"
                    :style="{background: '#'+cellColor(cell.displayState)}"
                >
                    <!-- {{ cell.state }} -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import CustomQBtn from 'src/components/CustomQBtn.vue';

const tab = ref('auto');
watch(tab, (newtab) => {
    clearPlacement();
});
const gridWidth = 10;
const gridArray = ref([]);
const shipLengths = ref([5, 4, 3, 3, 2, 2, 1, 1]);
const STATES = {
    BLANK: 0,
    PLACE: 1,
    MARGIN: 2,
    HIT: 3,
    MISS: 4
    // HOVER_PLACE: 5,
    // HOVER_MARGIN: 6
};

// test code
const shipsArray = ref([]);
function generateShipsArray () {
    shipsArray.value = shipLengths.value.map((len) => { return { len, place: false }; });
}

// generation of starting grid
function generateGrid () {
    gridArray.value = [];
    for (let R = 0; R < gridWidth; R++) {
        const rowArray = [];
        for (let C = 0; C < gridWidth; C++) {
            rowArray.push({
                // coordinate is only for debugging
                coordinate: `row ${R}, column ${C}`,
                displayState: STATES.BLANK,
                placementState: STATES.BLANK,
                ID: 0,
                isHit: false
            });
        }
        gridArray.value.push(rowArray);
    }
}
generateGrid();

// clear and confirming placements
function clearPlacement () {
    gridArray.value.forEach(row => row.forEach(cell => { cell.state = STATES.BLANK; }));
}
const gridConfirmed = ref(false);
const confirmedArray = ref([]);
const isFullPlacement = computed(() => shipsArray.value.every((ship) => ship.isPlaced));

function confirmPlacement () {
    confirmedArray.value = JSON.parse(JSON.stringify(gridArray.value));
    gridConfirmed.value = true;
    clearPlacement();
    gridArray.value.forEach(row => row.forEach(cell => { cell.displayState = STATES.BLANK; }));
}

// placement and validation
function doPlacement (coordinate, shipLength, goRight) {
    const R = coordinate.R;
    const C = coordinate.C;
    for (let i = 0; i < shipLength; i++) {
        if (goRight) {
            // color the ship itself
            gridArray.value[R][C + i].state = STATES.PLACE;
            // color all 6 blocks on both ends of the ship, if exist
            if (i === 0) {
                // left col
                if (C >= 1) {
                    // left end
                    gridArray.value[R][C - 1].state = STATES.MARGIN;
                    // left top
                    if (R >= 1) {
                        gridArray.value[R - 1][C - 1].state = STATES.MARGIN;
                    }
                    // left bttom
                    if (R + 1 < gridWidth) {
                        gridArray.value[R + 1][C - 1].state = STATES.MARGIN;
                    }
                }
                // right col
                if (C + shipLength < gridWidth) {
                    // right end
                    gridArray.value[R][C + shipLength].state = STATES.MARGIN;
                    // right top
                    if (R >= 1) {
                        gridArray.value[R - 1][C + shipLength].state = STATES.MARGIN;
                    }
                    // right bottom
                    if (R + 1 < gridWidth) {
                        gridArray.value[R + 1][C + shipLength].state = STATES.MARGIN;
                    }
                }
            }
            // if the row above exist
            if (R >= 1) {
                // color the block above the ship
                gridArray.value[R - 1][C + i].state = STATES.MARGIN;
            }
            // if bottom row exist
            if (R + 1 < gridWidth) {
                gridArray.value[R + 1][C + i].state = STATES.MARGIN;
            }
        } else {
            // color the ship itself
            gridArray.value[R + i][C].state = STATES.PLACE;
            // color all 6 blocks on both ends of the ship, if exist
            if (i === 0) {
                // if top row exist
                if (R >= 1) {
                    gridArray.value[R - 1][C].state = STATES.MARGIN;
                    // top left
                    if (C >= 1) {
                        gridArray.value[R - 1][C - 1].state = STATES.MARGIN;
                    }
                    // top right
                    if (C + 1 < gridWidth) {
                        gridArray.value[R - 1][C + 1].state = STATES.MARGIN;
                    }
                }
                // if bottom row exist
                if (R + shipLength < gridWidth) {
                    gridArray.value[R + shipLength][C].state = STATES.MARGIN;
                    // bottom left
                    if (C >= 1) {
                        gridArray.value[R + shipLength][C - 1].state = STATES.MARGIN;
                    }
                    // bottom right
                    if (C + 1 < gridWidth) {
                        gridArray.value[R + shipLength][C + 1].state = STATES.MARGIN;
                    }
                }
            }
            // left col
            if (C >= 1) {
                gridArray.value[R + i][C - 1].state = STATES.MARGIN;
            }
            // right col
            if (C + 1 < gridWidth) {
                gridArray.value[R + i][C + 1].state = STATES.MARGIN;
            }
        }
    }
}
function placeRightSuccess (coordinate, shipLength) {
    for (let len = 1; len < shipLength; len++) {
        const col = coordinate.C + len;
        if (col >= gridWidth) {
            return false;
        }
        const cell = gridArray.value[coordinate.R][col];
        if (cell.placementState !== STATES.BLANK) {
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
        if (cell.placementState !== STATES.BLANK) {
            return false;
        }
    }
    return true;
}

// auto place all
function autoPlace () {
    shipLengths.value.forEach(len => shipPlacement(len));
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
function getRndStart (shipLength) {
    const maxStartArea = gridWidth - shipLength;
    let R = getRandom(gridWidth);
    let C = getRandom(gridWidth);
    let randomCell = gridArray.value[R][C];

    // while (cell is unavailable OR not enough space for neither placement direction) is true
    // {get a new random start}
    while (randomCell.placementState !== STATES.BLANK || (R > maxStartArea && C > maxStartArea)) {
        R = getRandom(gridWidth);
        C = getRandom(gridWidth);
        randomCell = gridArray.value[R][C];
    }
    return { R, C };
}
function getRandom (max) {
    return Math.floor(Math.random() * max);
}
function directionRight () {
    // this return a boolean value for ship placement direction
    return (Math.random() < 0.5);
}

// manual placing
const manualLength = ref(0);
const manualPlaceRight = ref(true);
const manualDirectionDisplay = computed(() => manualPlaceRight.value ? 'Right' : 'Down');
function rotate () {
    manualPlaceRight.value = !manualPlaceRight.value;
}
function manualValidation (coordinate, len) {
    if (manualPlaceRight.value && placeRightSuccess(coordinate, len)) {
        doPlacement(coordinate, len, true);
    } else if (!manualPlaceRight.value && placeDownSuccess(coordinate, len)) {
        doPlacement(coordinate, len, false);
    } else {
        alert('Not enough room!');
    }
}


// game play
function isHit (coordinate) {
    if (confirmedArray.value[coordinate.R][coordinate.C].state === STATES.PLACE) {
        gridArray.value[coordinate.R][coordinate.C].state = STATES.HIT;
    } else {
        gridArray.value[coordinate.R][coordinate.C].state = STATES.MISS;
    }
}

function hoverState (R, C) {
    console.log('hey', R, C);
    // gridArray.value[R][C].state = 5;
}

// dynamic background color for cells
function cellColor (state) {
    switch (state) {
    case 0:
        return '948C15';
    case 1:
        return '971E1E';
    case 2:
        return '1B4D91';
    case 3:
        return 'B61A1A';
    case 4:
        return 'D4D4D4';
    // case 5:
    //     // hover
    //     return '911B8D';
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
.battleship-top-css {
    margin: 0% 1% 5% 1%
}
</style>
