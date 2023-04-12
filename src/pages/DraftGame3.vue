<template>
    <div>
        <q-btn
            label="toggle p1 active"
            @click="store.p1Active=!store.p1Active"
        />
        <q-btn
            label="toggle game end"
            @click="store.gameEnd=!store.gameEnd"
        />
        <div class="GameEndModal">
            <q-dialog v-model="store.gameEnd" persistent="">
                <q-card class="bg-info text-secondary">
                    <q-card-section>
                        <h1>Game End!</h1>
                    </q-card-section>
                    <q-card-actions align="center">
                        <q-btn
                            label="start new"
                            @click="newGame"
                            v-close-popup
                            outline
                        />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
        <div v-show="store.turnInterval">
            <h1>{{ turnPlayer }} ready?</h1>
            <q-btn
                label="next turn"
                @click="nextTurn"
            />
        </div>
        <div v-show="!store.turnInterval">
            <div v-if="!p1.placementConfirmed" class="row">
                <!-- question: does placement panel need to be here for consistency? -->
                <placement-header class="col" />
                <!-- note: h2 here needs to change to computed msg -->
                <div class="col"> <h2>Player 1 please choose fleet placement</h2> </div>
            </div>
            <div v-else-if="!p2.placementConfirmed" class="row">
                <div class="col"> <h2>Player 2 please choose fleet placement</h2> </div>
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
    </div>
</template>

<script setup>
import { toRef, computed } from 'vue';
import PlacementHeader from 'components/PlacementHeader.vue';
import AttackHeader from 'components/AttackHeader.vue';
import AttackPanel from 'components/AttackPanel.vue';
import { nextTurn, newGame } from 'components/helpers.js';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
store.initGame();

// question: I thought I should use toRefs, but appearant that give me error?
const p1 = toRef(store, 'p1');
const p2 = toRef(store, 'p2');
const isPlayerOne = true;
const turnPlayer = computed(() => store.p1Active ? 'Player 1' : 'Player 2');

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
