<template>
    <div>
        <div v-if="!p1.placementConfirmed" class="row">
            <placement-header class="col" />
            <div class="col"> <h2>!confirm.p1</h2> </div>
        </div>
        <div v-else-if="!p2.placementConfirmed" class="row">
            <div class="col"> <h2>!confirm.p2</h2> </div>
            <placement-header class="col" />
        </div>
        <div v-else class="row">
            <div class="col">
                <attack-header p1=true />
                <attack-panel :p1=true />
            </div>
            <div class="col">
                <attack-header :p1=false />
                <attack-panel :p1=false />
            </div>
        </div>
    </div>
</template>

<script setup>
import PlacementHeader from 'components/PlacementHeader.vue';
import AttackHeader from 'components/AttackHeader.vue';
import AttackPanel from 'components/AttackPanel.vue';

import { toRef, toRefs } from 'vue';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
store.initGame();
// not using fat arrow here may lead to problems...
// function onMounted () {
//     store.initGame();
// };

const p1Active = toRef(store, 'p1Active');
// question: I thought I should use toRefs, but appearant that give me error?
const p1 = toRef(store, 'p1');
const p2 = toRef(store, 'p2');
const testP1 = toRefs(store.p1);
function test () {
    testP1.ships.value.forEach(ship => console.log(`ship id is ${ship.ID}`));
    testP1.ships.value.forEach(ship => ship.ID++);
    // console.log(testP1.ships.value[0]);
}

</script>

<style>
.inline {
  display: inline-block;
}
.buttonRow {
    margin-bottom: 2%
}
.cell {
    background: #CA7070;
    width: 40px;
    height: 40px;
    border: 1px solid #D4D4D4;
    margin: -10% -10% -10% 0%
}
</style>
