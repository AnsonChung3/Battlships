<template>
    <div>
        <h1>{{ sampleText }}</h1>
        <div class="row">
            <left-player class="col"></left-player>
            <left-player class="col"></left-player>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import LeftPlayer from 'src/components/LeftPlayer.vue';

const sampleText = ref(`2nd Draft of Game`);

</script>

<style scoped>
</style>
