<template>
    <div class="battleship-top-css">
        <h2>{{ props.player }}</h2>
        <!-- placement tab / destroy status area -->
        <div v-if="!placementConfirmed">
            <q-card>
                <q-tabs
                    v-model="tab"
                    active-color="bg-negative"
                    class="bg-primary text-secondary"
                    dense
                >
                    <q-tab name="auto"     label="Auto"/>
                    <q-tab name="manual"   label="Manual"/>
                </q-tabs>
                <q-tab-panels v-model="tab" class="bg-info">
                    <q-tab-panel name="auto">
                        <div class="bg-info text-secondary">
                            <p>Press button to auto place all ships.</p>
                            <custom-q-btn
                                @click="autoPlace"
                                label="Auto Place"
                                :disabled=isFullPlacement
                            />
                        </div>
                    </q-tab-panel>
                    <q-tab-panel name="manual">
                        <div class="bg-info text-secondary">
                            <p>Pick the size of ship you want to place</p>
                            <custom-q-btn
                                v-for="(ship) in shipsArray" :key="ship.ID"
                                @click="shipSelect(ship.ID)"
                                :label=ship.len
                                :disabled="ship.isPlaced"
                                class="buttonRow"
                            />
                            <p>
                                <!-- click or press R to rotate -->
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
                    @click="clearPlacement"
                    label="Clear Placement"
                />
                <custom-q-btn
                    :disabled=!isFullPlacement
                    @click="confirmPlacement"
                    label="Confirm Placement"
                />
            </div>
        </div>
        <div v-else>
            <q-card class="bg-info text-secondary">
                <q-card-section>
                    <p>Ships Left</p>
                    <!-- some more work to show ship length for each of the ships -->
                    <div v-for="(ship) in shipsArray" :key=ship.ID class="inline">
                        <progress-q-btn
                            :label=ship.ID
                            :shipState=ship.isDestroyed
                        />
                    </div>
                </q-card-section>
            </q-card>
        </div>
        <!-- play area -->
        <div v-for="(row, R) in gridArray" :key="R">
            <div class="inline" v-for="(cell, C) in row" :key="C">
                <!-- cells are clickable when in manual mode -->
                <div
                    v-if="!placementConfirmed"
                    @click="manualValidation({R, C}, manualID, manualPlaceRight)"
                    @mouseover="hoverState({R, C})"
                    class="cell"
                    :style="{background: '#'+cellColor(R, C)}"
                >
                    ID: {{ cell.ID }}
                    P: {{ cell.placementState }}
                </div>
                <!-- display at play stage
                when it's home turn, it should show
                (1)Dis:PLACED Pla:PLACED Dam:BLANK
                (2)Dis:HIT Pla:PLACED Dam:HIT
                (3)Dis:MISS Pla:!PLACED
                when it's opponent's turn, it should show
                (1)HIT
                (2)MISS -->
                <div
                    v-else
                    @click="isHit({R, C})"
                    class="cell"
                    :style="{background: '#'+cellColor(R, C)}"
                >
                    ID: {{ cell.ID }}
                    P: {{ cell.placementState }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import CustomQBtn from 'src/components/CustomQBtn.vue';
import ProgressQBtn from 'src/components/ProgressQBtn.vue';

const props = defineProps({
    player: String
});

// clear placement when switching mode
const tab = ref('auto');
watch(tab, (newtab) => {
    clearPlacement();
});

const gridWidth = 10;
const gridArray = ref([]);
const placementConfirmed = ref(false);
const shipLengths = [5, 4, 3, 3, 2, 2, 1, 1];
const shipsArray = ref([]);
const STATES = {
    BLANK: 0,
    PLACED: 1,
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
            isDestroyed: false
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

function clearPlacement () {
    generateGrid();
    generateShipsArray();
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
const manualID = ref(0);
const manualPlaceRight = ref(true);
const manualDirectionDisplay = computed(() => manualPlaceRight.value ? 'Right' : 'Down');
const manualSelect = ref(false);
function rotate () {
    manualPlaceRight.value = !manualPlaceRight.value;
}
function manualValidation (coordinate, ID, goRight) {
    if ((tab.value === 'auto') || (manualSelect.value === false)) {
        return;
    }
    const len = shipsArray.value[ID - 1].len;
    if ((goRight && placeRightSuccess(coordinate, len)) || (!goRight && placeDownSuccess(coordinate, len))) {
        doPlacement(coordinate, len, goRight, ID);
        shipsArray.value[ID - 1].isPlaced = true;
        manualSelect.value = false;
    } else {
        alert('Not enough room!');
    }
}
function shipSelect (ID) {
    manualID.value = ID;
    manualSelect.value = true;
}
function hoverState (R, C) {
    // console.log('hey', R, C);
    // gridArray.value[R][C].state = 5;
}

// game play
const emit = defineEmits(['game-end']);

function isHit (coordinate) {
    const checkCell = gridArray.value[coordinate.R][coordinate.C];
    checkCell.isHit = true;
    if (checkCell.placementState === STATES.PLACED && isDestroyed(checkCell.ID)) {
        shipsArray.value[checkCell.ID - 1].isDestroyed = true;
        console.log(`ship ID ${shipsArray.value[checkCell.ID - 1].ID} is destroyed`);
        const isEnd = shipsArray.value.every(ship => ship.isDestroyed);
        if (isEnd) {
            console.log(`emit end from ${props.player}`);
            emit('game-end');
        }
    }
}

function hoverState (R, C) {
    console.log('hey', R, C);
    // gridArray.value[R][C].state = 5;
function isDestroyed (ID) {
    const cells = gridArray.value.flat().filter(cell => cell.ID === ID);
    return (cells.every(cell => cell.isHit));
}

// dynamic background color for cells
const homePanel = ref(true);
const COLORS = {
    BLANK: '948C15',
    PLACED: '1F9415',
    MARGIN: '13468C',
    HIT: '921313',
    MISS: '383232'
};

function cellColor (R, C) {
    const cell = gridArray.value[R][C];
    if (!placementConfirmed.value) {
        if (cell.placementState === STATES.PLACED) {
            return COLORS.HIT;
        }
        if (cell.placementState === STATES.MARGIN) {
            return COLORS.MARGIN;
        } else {
            return COLORS.BLANK;
        }
    } else if (homePanel.value) {
        if (cell.placementState === STATES.PLACED) {
            if (cell.isHit) {
                return COLORS.HIT;
            } else {
                return COLORS.PLACED;
            }
        } else {
            if (cell.isHit) {
                return COLORS.MISS;
            } else {
                return COLORS.BLANK;
            }
        }
    } else {
        if (!cell.isHit) {
            return COLORS.BLANK;
        } else if (cell.placementState === STATES.PLACED) {
            return COLORS.HIT;
        } else {
            return COLORS.MISS;
        }
    }
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
