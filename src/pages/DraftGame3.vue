<template>
    <div>
        <div v-if="!confirm.p1" class="row">
            <placement-header class="col" />
            <div class="col"> <h2>!confirm.p1</h2> </div>
        </div>
        <div v-else-if="!confirm.p2" class="row">
            <div class="col"> !confirm.p2 </div>
            <placement-header class="col" />
        </div>
        <div v-else class="row">
            <div class="col">
                <attack-header/>
                <attack-panel/>
            </div>
            <div class="col">
                <attack-header/>
                <attack-panel/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

import AttackHeader from 'components/AttackHeader.vue';
import AttackPanel from 'components/AttackPanel.vue';
import PlacementHeader from 'components/PlacementHeader.vue';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
store.generateGrid();
store.generateShipsArray();

const confirm = ref({ p1: false, p2: false });

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
