<template>
    <div>
        <h1>{{ sampleText }}</h1>
        <div v-for="(row, y) in mapArray" :key="y">
            <div class="inline" v-for="(cell, x) in row" :key="x">
                <div class="cell" :style="{background: '#'+cell.state}"> {{ cell.coordinate }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const sampleText = ref('Battleship draft game');

const mapArray = ref([]);
function generateMap () {
    for (let row = 0; row < 5; row++) {
        const rowArray = [];
        for (let column = 0; column < 5; column++) {
            rowArray.push({ coordinate: `${row}, ${column}`, state: 'CA7070' });
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
