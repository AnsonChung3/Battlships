<template>
    <div>
        <div v-for="(row, R) in gridArray" :key="R">
            <div class="inline" v-for="(cell, C) in row" :key="C">
                <!-- cells are clickable when in manual mode -->
                <div
                    v-if="!placementConfirmed"
                    @click="manualValidation(R, C, manualID, manualPlaceRight)"
                    @mouseover="hoverState({R, C})"
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
// gridArray
// placementConfirmed
// manualvalidation
// cellColoe
</script>

<style scoped>
/* inline */
</style>