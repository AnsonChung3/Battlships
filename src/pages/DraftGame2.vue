<template>
    <div>
        <h1>{{ headerText }}</h1>
        <q-btn
            @click="p1Active = !p1Active"
            label="toggle"
        />
        <div class="row">
            <div class="col">
                <player-panel
                    v-show="p1Active"
                    @confirm="playerConfirm(1)"
                    @game-end="end"
                    @shoot="playerTakeTurn"
                    :player=headerP1
                    :home=p1Active
                />
                <div v-if="!p1Confirm">
                    <div v-show="!p1Active">
                        <h1> {{ msgForP2 }} </h1>
                    </div>
                </div>
            </div>
            <div class="col">
                <player-panel
                    v-show="!p1Active"
                    @confirm="playerConfirm(2)"
                    @game-end="end"
                    @shoot="playerTakeTurn"
                    :player=headerP2
                    :home=!Ksp1Active
                />
                <div v-if="!p2Confirm">
                    <div v-show="p1Active">
                        <h1> {{ msgForP1 }} </h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import PlayerPanel from 'src/components/PlayerPanel.vue';

const headerText = ref(`Battleship`);
const p1Active = ref(true);
const p1Confirm = ref(false);
const p2Confirm = ref(false);
const msgForP1 = ref('Player 1 please confirm placement.');
const msgForP2 = ref('Player 2 please confirm placement.');
const headerP1 = ref('Player 1');
const headerP2 = ref('Player 2');

function end () {
    console.log('draft game 2');
}

function playerConfirm (P) {
    console.log(`player ${P} confirm`);
    p1Active.value = !p1Active.value;
    if (P === 1) {
        p1Confirm.value = true;
        headerP1.value = "Player 1's turn to shoot";
    } else {
        p2Confirm.value = true;
        headerP2.value = "Player 2's turn to shoot";
    }
}

function playerTakeTurn () {
    if (p1Confirm.value === true && p2Confirm.value === true) {
        console.log('cover toggle');
        setTimeout(() => {
            p1Active.value = !p1Active.value;
        }, 1500);
    }
}

</script>

<style scoped>

</style>
