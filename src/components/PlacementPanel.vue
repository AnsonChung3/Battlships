<template>
    <div>
        <div v-for="(row, R) in gridArray" :key="R">
            <div class="inline" v-for="(cell, C) in row" :key="C">
                <!-- cells are only for display when in auto mode -->
                <div
                    v-if="auto"
                    class="cell"
                    :style="{background: '#'+cellColor(R, C)}"
                >
                    ID: {{ cell.ID }}
                    P: {{ cell.placement }}
                </div>
                <!-- cells are clickable only when in manual mode -->
                <!-- <div
                    v-else
                    @click="manualValidation(R, C, manualID, manualPlaceRight)"
                    @mouseover="hoverState({R, C})"
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
const props = defineProps({
    auto: Boolean,
    gridArray: Array
});
const auto = toRef(props, 'auto');
const gridArray = toRef(props, 'gridArray');
import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const STATES = store.STATES;
const COLORS = store.COLORS;

function cellColor (R, C) {
    const cell = gridArray.value[R][C];
    if (cell.placement === STATES.PLACED) {
        return COLORS.HIT;
    }
    if (cell.placement === STATES.MARGIN) {
        return COLORS.MARGIN;
    } else {
        return COLORS.BLANK;
    }
}
// gridArray
// placementConfirmed
// manualvalidation
// cellColoe
</script>
