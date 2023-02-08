<template>
    <div>
        <h1>{{ sampleText }}</h1>
        <div class="row">
            <player-panel class="col"></player-panel>
            <player-panel class="col"></player-panel>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import PlayerPanel from 'src/components/PlayerPanel.vue';

const sampleText = ref(`2nd Draft of Game`);

</script>

<style scoped>
</style>
