<template>
    <div>
        <h1>{{ headerText }}</h1>
        <q-btn
            @click="p1Active = !p1Active"
            label="toggle"
        />
        <div class="row">
            <div class="col">
                <div v-show="!p1Active">
                    <h1> {{ msgForP2 }} </h1>
                </div>
                <player-panel
                    v-show="p1Active"
                    @confirm="confirmLeft"
                    @game-end="end"
                    @click="coverToggle"
                    player="Player 1"
                />
            </div>
            <div class="col">
                <div v-show="p1Active">
                    <h1> {{ msgForP1 }} </h1>
                </div>
                <player-panel
                    v-show="!p1Active"
                    @confirm="confirmRight"
                    @game-end="end"
                    @click="coverToggle"
                    player="Player 2"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import PlayerPanel from 'src/components/PlayerPanel.vue';

const headerText = ref(`Battleship`);
const p1Active = ref(false);
const leftConfirmedPlace = ref(false);
const rightConfirmedPlace = ref(false);
const msgForP1 = ref('Player 1 please confirm placement.');
const msgForP2 = ref('Player 2 please confirm placement.');

function end () {
    console.log('draft game 2');
}

function confirmLeft () {
    console.log('confirm left');
    p1Active.value = !p1Active.value;
    leftConfirmedPlace.value = true;
    msgForP1.value = `Player 1's turn to shoot`;
}

function confirmRight () {
    console.log('confirm right');
    // p1Active.value = !p1Active.value;
    rightConfirmedPlace.value = true;
    msgForP2.value = `Player 2's turn to shoot`;
}

function coverToggle () {
    if (leftConfirmedPlace.value === true && rightConfirmedPlace.value === true) {
        console.log('cover toggle');
        setTimeout(() => {
            p1Active.value = !p1Active.value;
        }, 1500);
    }
}

</script>

<style scoped>

</style>
