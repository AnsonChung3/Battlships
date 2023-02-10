<template>
    <div class="battleship-top-css">
        <h2>Player Panel</h2>
        <q-card v-if="!placementConfirmed">
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
                    v-else-if="!placementConfirmed"
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

// clear placement when switching mode
const tab = ref('auto');
watch(tab, (newtab) => {
    generateGrid();
});

const gridWidth = 10;
const gridArray = ref([]);
const placementConfirmed = ref(false);
const shipLengths = [5, 4, 3, 3, 2, 2, 1, 1];
const shipsArray = ref([]);
const STATES = {
    BLANK: 0,
    PLACE: 1,
    MARGIN: 2,
    HIT: 3,
    MISS: 4
    // HOVER_PLACE: 5,
    // HOVER_MARGIN: 6
};

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

// generation of ship array, to assist isDestroy and :disabled="fullPlacement"
function generateShipsArray () {
    shipsArray.value = shipLengths.map((len, index) => {
        return {
            len,
            ID: index + 1,
            isPlaced: false,
            // isDestroyed: ,
            coordinates: []
        };
    });
}
generateShipsArray();
const isFullPlacement = computed(() => shipsArray.value.every((ship) => ship.isPlaced));

// confirming placements and clear display
function confirmPlacement () {
    placementConfirmed.value = true;
    gridArray.value.forEach(row => row.forEach(cell => { cell.displayState = STATES.BLANK; }));
}

// placement and validation
function doPlacement (coordinate, shipLength, goRight, ID) {
    const R = coordinate.R;
    const C = coordinate.C;
    for (let i = 0; i < shipLength; i++) {
        if (goRight) {
            colorShip(R, C + i, ID);
            // color left/right end of ship once
            if (i === 0) {
                // left end
                if (C >= 1) {
                    colorMargin(R, C - 1);
                    // left top
                    if (R >= 1) {
                        colorMargin(R - 1, C - 1);
                    }
                    // left bttom
                    if (R + 1 < gridWidth) {
                        colorMargin(R + 1, C - 1);
                    }
                }
                // right end
                if (C + shipLength < gridWidth) {
                    colorMargin(R, C + shipLength);
                    // right top
                    if (R >= 1) {
                        colorMargin(R - 1, C + shipLength);
                    }
                    // right bottom
                    if (R + 1 < gridWidth) {
                        colorMargin(R + 1, C + shipLength);
                    }
                }
            }
            // if the row above exist, color cell above
            if (R >= 1) {
                colorMargin(R - 1, C + i);
            }
            // if bottom row existm coloe cell below
            if (R + 1 < gridWidth) {
                colorMargin(R + 1, C + i);
            }
        } else {
            colorShip(R + i, C, ID);
            // color top/bottom ends once
            if (i === 0) {
                // top end
                if (R >= 1) {
                    colorMargin(R - 1, C);
                    // top left
                    if (C >= 1) {
                        colorMargin(R - 1, C - 1);
                    }
                    // top right
                    if (C + 1 < gridWidth) {
                        colorMargin(R - 1, C + 1);
                    }
                }
                // bottom end
                if (R + shipLength < gridWidth) {
                    colorMargin(R + shipLength, C);
                    // bottom left
                    if (C >= 1) {
                        colorMargin(R + shipLength, C - 1);
                    }
                    // bottom right
                    if (C + 1 < gridWidth) {
                        colorMargin(R + shipLength, C + 1);
                    }
                }
            }
            // left col
            if (C >= 1) {
                colorMargin(R + i, C - 1);
                gridArray.value[R + i][C - 1].state = STATES.MARGIN;
            }
            // right col
            if (C + 1 < gridWidth) {
                colorMargin(R + i, C + 1);
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
function colorShip (R, C, ID) {
    gridArray.value[R][C].displayState = STATES.PLACED;
    gridArray.value[R][C].placementState = STATES.PLACED;
    gridArray.value[R][C].ID = ID;
}
function colorMargin (R, C) {
    gridArray.value[R][C].displayState = STATES.MARGIN;
    gridArray.value[R][C].placementState = STATES.MARGIN;
}

// auto place all
function autoPlace () {
    shipsArray.value.forEach((ship) => {
        shipPlacement(ship.len, ship.ID);
        ship.isPlaced = true;
    });
}
function shipPlacement (shipLength, ID) {
    // e.g. startCell = {R: 1, C: 2}
    const startCell = getRndStart(shipLength);
    if (shipLength === 1) {
        doPlacement(startCell, shipLength, true, ID);
        return;
    }
    const right = placeRightSuccess(startCell, shipLength);
    const down = placeDownSuccess(startCell, shipLength);
    let goRight = true;
    if (!right) {
        goRight = false;
    } else if (right && down) {
        goRight = directionRight();
    }
    doPlacement(startCell, shipLength, goRight, ID);
}
function getRndStart (shipLength) {
    const maxStartArea = gridWidth - shipLength;
    let R = getRandom(gridWidth);
    let C = getRandom(gridWidth);
    let randomCell = gridArray.value[R][C];

    // while (cell is unavailable OR can be placed in neither direction) is true
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
    // rnd when right and down are both viable
    return (Math.random() < 0.5);
}

// manual placing
const manualLength = ref(0);
const manualPlaceRight = ref(true);
const manualDirectionDisplay = computed(() => manualPlaceRight.value ? 'Right' : 'Down');
function rotate () {
    manualPlaceRight.value = !manualPlaceRight.value;
}
function manualValidation (coordinate, len, goRight) {
    if (goRight && placeRightSuccess(coordinate, len)) {
        doPlacement(coordinate, len, true);
    } else if (placeDownSuccess(coordinate, len)) {
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
