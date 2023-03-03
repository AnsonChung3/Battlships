<template>
    <div>
        <!-- game panel is created once both players have confirmed placement
        would be on at all times, except showing different info
        for when it's showing as home/opponent panel -->
        <div v-for="(row, R) in gridArray" :key="R">
            <div class="inline" v-for="(cell, C) in row" :key="C">
                <div
                    class="cell"
                    :style="{background: '#'+cellColor(R, C)}"
                >
                    ID: {{ cell.ID }}
                    P: {{ cell.placement }}
                </div>
                <!-- cells are only clickable when it's showing as opponent panel -->
                <!-- <div
                    v-else
                    @click="isAttackLand(R, C)"
                    class="cell"
                    :style="{background: '#'+cellColor(R, C)}"
                >
                    ID: {{ cell.ID }}
                    P: {{ cell.placement }}
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { toRef } from 'vue';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const gridArray = toRef(store, 'gridArray');
const STATES = store.STATES;
const COLORS = store.COLORS;

// cellColor can be further modded to with only home/opponent view
function cellColor (R, C) {
    const cell = gridArray.value[R][C];
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
    // if (homePanel.value) {
    //     if (cell.placement === STATES.PLACED) {
    //         if (cell.isHit) {
    //             return COLORS.HIT;
    //         } else {
    //             return COLORS.PLACED;
    //         }
    //     } else {
    //         if (cell.isHit) {
    //             return COLORS.MISS;
    //         } else {
    //             return COLORS.BLANK;
    //         }
    //     }
    // } else {
    //     if (!cell.isHit) {
    //         return COLORS.BLANK;
    //     } else if (cell.placement === STATES.PLACED) {
    //         return COLORS.HIT;
    //     } else {
    //         return COLORS.MISS;
    //     }
    // }
}

// homePanel doesn't need to be props any more, just make it a store state
// props.homePanel

// function isAttackLand (R, C) {
//     const checkCell = gridArray.value[R][C];
//     checkCell.isHit = true;
//     if (checkCell.placement === STATES.PLACED && isDestroyed(checkCell.ID)) {
//         shipsArray.value[checkCell.ID - 1].isSunk = true;
//         console.log(`ship ID ${checkCell.ID} is destroyed`);
//         const isEnd = shipsArray.value.every(ship => ship.isSunk);
//         if (isEnd) {
//             console.log(`emit end from ${props.player}`);
//             emit('game-end');
//         }
//     }
//     emit('shoot');
// }
</script>

<style scoped>
/* inline
cell */
</style>
