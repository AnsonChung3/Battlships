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
// const gridArray = store.gridArray
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
