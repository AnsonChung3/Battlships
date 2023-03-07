<template>
    <div>
        <q-card>
            <q-tabs
                v-model="tab"
                active-color="bg-negative"
                class="bg-1imary text-secondary"
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
                <!-- manual mode will be worked on when auto mode is finished modding -->
                <q-tab-panel name="manual">
                    <div class="bg-info text-secondary">
                        <p>Pick the size of ship you want to place</p>
                        <custom-q-btn
                            v-for="(ship) in shipsArray" :key="ship.ID"
                            @click="shipSelect(ship.ID)"
                            :label=ship.len
                            :disabled="ship.isSet"
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
        <placement-panel
            :auto="tab==='auto'"
        />
    </div>
</template>

<script setup>
import { ref, watch, computed, toRef, toRefs } from 'vue';
import CustomQBtn from 'src/components/CustomQBtn.vue';
import PlacementPanel from 'components/PlacementPanel.vue';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const STATES = store.STATES;
const gridWidth = store.gridWidth;

const p1Active = toRef(store, 'p1Active');
const player = p1Active.value ? toRefs(store.p1) : toRefs(store.p2);
const gridArray = player.grid;
const shipsArray = player.ships;

const tab = ref('auto');
// watcher seems working fine. Check if problem
watch(tab, (newtab) => {
    clearPlacement();
});

const isFullPlacement = computed(() => shipsArray.value.every((ship) => ship.isSet));
function clearPlacement () {
    gridArray.value.forEach(row => row.forEach(cell => {
        cell.display = STATES.BLANK;
        cell.placement = STATES.BLANK;
        cell.ID = 0;
    }));
    shipsArray.value.forEach(ship => { ship.isSet = false; });
}
function confirmPlacement () {
    player.placementConfirmed.value = true;
    p1Active.value = !p1Active.value;
}

function autoPlace () {
    shipsArray.value.forEach((ship) => {
        shipPlacement(ship.len, ship.ID);
        ship.isSet = true;
    });
}
function shipPlacement (shipLength, ID) {
    // e.g. startCell = {R: 1, C: 2}
    const startCell = getRndStart(shipLength);
    const R = startCell.R;
    const C = startCell.C;
    if (shipLength === 1) {
        doPlacement(R, C, shipLength, true, ID);
        return;
    }
    const right = placeRightSuccess(R, C, shipLength);
    const down = placeDownSuccess(R, C, shipLength);
    let goRight = true;
    if (!right) {
        goRight = false;
    } else if (right && down) {
        goRight = directionRight();
    }
    doPlacement(R, C, shipLength, goRight, ID);
}
function getRndStart (shipLength) {
    const maxStartArea = gridWidth - shipLength;
    let R = getRandom(gridWidth);
    let C = getRandom(gridWidth);
    let rndCell = gridArray.value[R][C];

    // while (cell is unavailable OR can be placed in neither direction) is true
    // {get a new random start}
    while (rndCell.placement !== STATES.BLANK || (R > maxStartArea && C > maxStartArea)) {
        R = getRandom(gridWidth);
        C = getRandom(gridWidth);
        rndCell = gridArray.value[R][C];
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

function doPlacement (R, C, shipLength, goRight, ID) {
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
                    if (R + 1 < gridWidth) {
                        colorMargin(R + 1, C - 1);
                    }
                }
                // right end, top, bottm
                if (C + shipLength < gridWidth) {
                    colorMargin(R, C + shipLength);
                    if (R >= 1) {
                        colorMargin(R - 1, C + shipLength);
                    }
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
                // top end, left, right
                if (R >= 1) {
                    colorMargin(R - 1, C);
                    if (C >= 1) {
                        colorMargin(R - 1, C - 1);
                    }
                    if (C + 1 < gridWidth) {
                        colorMargin(R - 1, C + 1);
                    }
                }
                // bottom end, left, right
                if (R + shipLength < gridWidth) {
                    colorMargin(R + shipLength, C);
                    if (C >= 1) {
                        colorMargin(R + shipLength, C - 1);
                    }
                    if (C + 1 < gridWidth) {
                        colorMargin(R + shipLength, C + 1);
                    }
                }
            }
            // left col
            if (C >= 1) {
                colorMargin(R + i, C - 1);
            }
            // right col
            if (C + 1 < gridWidth) {
                colorMargin(R + i, C + 1);
            }
        }
    }
}
function placeRightSuccess (R, C, shipLength) {
    for (let len = 1; len < shipLength; len++) {
        const col = C + len;
        if (col >= gridWidth) {
            return false;
        }
        const cell = gridArray.value[R][col];
        if (cell.placement !== STATES.BLANK) {
            return false;
        }
    }
    return true;
}
function placeDownSuccess (R, C, shipLength) {
    for (let len = 1; len < shipLength; len++) {
        const row = R + len;
        if (row >= gridWidth) {
            return false;
        }
        const cell = gridArray.value[row][C];
        if (cell.placement !== STATES.BLANK) {
            return false;
        }
    }
    return true;
}
function colorShip (R, C, ID) {
    gridArray.value[R][C].display = STATES.PLACED;
    gridArray.value[R][C].placement = STATES.PLACED;
    gridArray.value[R][C].ID = ID;
}
function colorMargin (R, C) {
    gridArray.value[R][C].display = STATES.MARGIN;
    gridArray.value[R][C].placement = STATES.MARGIN;
}
</script>
