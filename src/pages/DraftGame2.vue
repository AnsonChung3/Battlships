<template>
    <div>
        <h1>{{ sampleText }}</h1>
        <div v-for="(row, R) in mapArray" :key="R">
            <div class="inline" v-for="(cell, C) in row" :key="C">
                <div
                    class="cell"
                    :style="{background: '#'+cellColor(cell.state)}"
                    @click="cell.state++"
                >
                    {{ [R, C] }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const sampleText = ref(`let's try to break the shipPlacement ( ) down`);

const sampleGridWidth = 5;
const mapArray = ref([]);
function generateMap () {
    for (let R = 0; R < sampleGridWidth; R++) {
        const rowArray = [];
        for (let C = 0; C < sampleGridWidth; C++) {
            rowArray.push({ coordinate: `row ${R}, column ${C}`, state: 0 });
        }
        mapArray.value.push(rowArray);
    }
}
generateMap();

</script>

<style scoped>
.inline {
  display: inline-block;
}
.cell {
    background: #CA7070;
    width: 50px;
    height: 50px;
    border: 1px solid #D4D4D4
}
</style>