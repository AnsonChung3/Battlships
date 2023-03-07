<template>
    <div>
        <q-btn
            label="toggle p1 active"
            @click="store.p1Active = !store.p1Active"
        />
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
                <attack-header :p1=isPlayerOne />
                <attack-panel :p1=isPlayerOne />
            </div>
            <div class="col">
                <attack-header :p1=!isPlayerOne />
                <attack-panel :p1=!isPlayerOne />
            </div>
        </div>
    </div>
</template>

<script setup>
import PlacementHeader from 'components/PlacementHeader.vue';
import AttackHeader from 'components/AttackHeader.vue';
import AttackPanel from 'components/AttackPanel.vue';

import { toRef } from 'vue';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
store.initGame();

// question: I thought I should use toRefs, but appearant that give me error?
const p1 = toRef(store, 'p1');
const p2 = toRef(store, 'p2');
const isPlayerOne = true;
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
