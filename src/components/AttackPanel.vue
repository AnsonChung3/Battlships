<template>
    <div>
        <!-- game panel is created once both players have confirmed placement
        would be on at all times, except showing different info
        for when it's showing as home/opponent panel -->
        <div v-for="(row, R) in gridArray" :key="R">
            <div class="inline" v-for="(cell, C) in row" :key="C">
                <div
                    v-if="homePanel"
                    class="cell"
                    :style="{background: '#'+cellColor(R, C)}"
                >
                    ID: {{ cell.ID }}
                    P: {{ cell.placement }}
                </div>
                <!-- cells are only clickable when it's showing as opponent panel -->
                <div
                    v-else
                    @click="isAttackLand(R, C)"
                    class="cell"
                    :style="{background: '#'+cellColor(R, C)}"
                >
                    ID: {{ cell.ID }}
                    P: {{ cell.placement }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { toRef } from 'vue';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const shipsArray = store.shipsArray;
const STATES = store.STATES;
const COLORS = store.COLORS;

// gridArray should later be modded to another prop?
const gridArray = toRef(store, 'gridArray');

// homePanel needs to be props
const props = defineProps({
    home: Boolean
});
const homePanel = toRef(props, 'home');

function cellColor (R, C) {
    const cell = gridArray.value[R][C];
    if (homePanel.value === true) {
        if (cell.placement === STATES.PLACED) {
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
        } else if (cell.placement === STATES.PLACED) {
            return COLORS.HIT;
        } else {
            return COLORS.MISS;
        }
    }
}

// dependent methods for isAttackLand: isDestroyed, isEnd
function isAttackLand (R, C) {
    const checkCell = gridArray.value[R][C];
    checkCell.isHit = true;
    if (checkCell.placement === STATES.PLACED && isDestroyed(checkCell.ID)) {
        shipsArray.value[checkCell.ID - 1].isSunk = true;
        console.log(`ship ID ${checkCell.ID} is destroyed`);
        const isEnd = shipsArray.value.every(ship => ship.isSunk);
        if (isEnd) {
            console.log(`emit end from ${props.player}`);
            // emit('game-end');
        }
    }
//     no need to emit anymore? as it can take turn by changing p1Active from anywhere
//     emit('shoot');
}

function isDestroyed (ID) {
    const cells = gridArray.value.flat().filter(cell => cell.ID === ID);
    return (cells.every(cell => cell.isHit));
}

</script>
