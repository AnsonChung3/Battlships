<template>
    <div>
        <h1>{{ sampleText }}</h1>
        <div class="row">
            <player-panel
                @game-end="end"
                player="Player 1"
                class="col"
            />
            <player-panel
                @game-end="end"
                player="Player 2"
                class="col"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import PlayerPanel from 'src/components/PlayerPanel.vue';

const sampleText = ref(`2nd Draft of Game`);

function end () {
    console.log('draft game 2');
}

</script>

<style scoped>

</style>
