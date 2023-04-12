<template>
    <div>
        <!-- game panel is created once both players have confirmed placement
        would be on at all times, except showing different info
        for when it's showing as home/opponent panel -->
        <div v-for="(row, R) in gridArray" :key="R">
            <div class="inline" v-for="(cell, C) in row" :key="C">
                <!-- v-if logic can potentially change to v-show -->
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
import { ref, toRef, toRefs, computed } from 'vue';
import { nextTurn } from 'components/helpers.js';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const STATES = store.STATES;
const COLORS = store.COLORS;

const p1Active = toRef(store, 'p1Active');
const props = defineProps({
    p1: Boolean
});
const p1 = toRef(props, 'p1');
const homePanel = computed(() => { return (p1.value === p1Active.value); });

const player = p1.value ? toRefs(store.p1) : toRefs(store.p2);
const gridArray = player.grid;
const shipsArray = player.ships;

function cellColor (R, C) {
    const cell = gridArray.value[R][C];
    if (homePanel.value) {
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

const isAttackAbled = ref(true);

// isAttackLand can have further checks
function isAttackLand (R, C) {
    const checkCell = gridArray.value[R][C];
    if (!isAttackAbled.value || checkCell.isHit) {
        return;
    }
    isAttackAbled.value = !isAttackAbled.value;
    checkCell.isHit = true;
    if (checkCell.placement === STATES.PLACED && isDestroyed(checkCell.ID)) {
        shipsArray.value[checkCell.ID - 1].isSunk = true;
        console.log(`ship ID ${checkCell.ID} is destroyed`);
        const isEnd = shipsArray.value.every(ship => ship.isSunk);
        if (isEnd) {
            console.log(`game end`);
            store.gameEnd = !store.gameEnd;
        }
    }
    setTimeout(() => {
        nextTurn();
        store.p1Active = !store.p1Active;
        isAttackAbled.value = !isAttackAbled.value;
    }, 1000);
}
// isDestroyed seems to be fine. Check if problem
function isDestroyed (ID) {
    const cells = gridArray.value.flat().filter(cell => cell.ID === ID);
    return (cells.every(cell => cell.isHit));
}
</script>
