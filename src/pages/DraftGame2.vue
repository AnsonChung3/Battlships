<template>
    <div>
        <h1>{{ sampleText }}</h1>
        <q-btn
            @click="coverLeft = !coverLeft"
            label="toggle"
        />
        <div class="row">
            <div class="col">
                <div v-show="coverLeft">
                    <h1> {{ msgForRight }} </h1>
                </div>
                <player-panel
                    v-show="!coverLeft"
                    @confirm="confirmLeft"
                    @game-end="end"
                    @click="coverToggle"
                    player="Player 1"
                />
            </div>
            <div class="col">
                <div v-show="!coverLeft">
                    <h1> {{ msgForLeft }} </h1>
                </div>
                <player-panel
                    v-show="coverLeft"
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

const sampleText = ref(`Battleship`);
const coverLeft = ref(false);
const leftConfirmedPlace = ref(false);
const rightConfirmedPlace = ref(false);
const msgForLeft = ref('Player 1 please confirm placement.');
const msgForRight = ref('Player 2 please confirm placement.');

function end () {
    console.log('draft game 2');
}

function confirmLeft () {
    console.log('confirm left');
    coverLeft.value = !coverLeft.value;
    leftConfirmedPlace.value = true;
    msgForLeft.value = `Player 1's turn to shoot`;
}

function confirmRight () {
    console.log('confirm right');
    // coverLeft.value = !coverLeft.value;
    rightConfirmedPlace.value = true;
    msgForRight.value = `Player 2's turn to shoot`;
}

function coverToggle () {
    if (leftConfirmedPlace.value === true && rightConfirmedPlace.value === true) {
        console.log('cover toggle');
        setTimeout(() => {
            coverLeft.value = !coverLeft.value;
        }, 1500);
    }
}

</script>

<style scoped>

</style>
