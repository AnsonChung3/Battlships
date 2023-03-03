<template>
    <div>
        <div class="row">
            <div class="col">
                <placement-header/>
            </div>
            <div class="col">
                <attack-header/>
                <attack-panel/>
            </div>
        </div>
    </div>
</template>

<script setup>
import AttackHeader from 'components/AttackHeader.vue';
import AttackPanel from 'components/AttackPanel.vue';
import PlacementHeader from 'components/PlacementHeader.vue';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
store.generateGrid();
store.generateShipsArray();

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
