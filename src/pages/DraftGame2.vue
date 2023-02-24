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
                    player="Player 1"
                />
                <div v-show="!p1Active">
                    <h1> {{ msgForP2 }} </h1>
                </div>
            </div>
            <div class="col">
                <player-panel
                    v-show="!p1Active"
                    @confirm="playerConfirm(2)"
                    @game-end="end"
                    @shoot="playerTakeTurn"
                    player="Player 2"
                />
                <div v-show="p1Active">
                    <h1> {{ msgForP1 }} </h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import PlayerPanel from 'src/components/PlayerPanel.vue';

const headerText = ref(`Battleship`);
const p1Active = ref(false);
const p1Confirm = ref(false);
const p2Confirm = ref(false);
const msgForP1 = ref('Player 1 please confirm placement.');
const msgForP2 = ref('Player 2 please confirm placement.');

function end () {
    console.log('draft game 2');
}

function playerConfirm (P) {
    console.log(`player ${P} confirm`);
    p1Active.value = !p1Active.value;
    if (P === 1) {
        p1Confirm.value = true;
        msgForP1.value = `Player 1's turn to shoot`;
    } else {
        p2Confirm.value = true;
        msgForP2.value = `Player 2's turn to shoot`;
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
