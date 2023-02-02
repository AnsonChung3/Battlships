<template>
    <div>
        <h1>{{ sampleText }}</h1>
        <q-card>
            <q-tabs
                v-model="tab"
                active-color="bg-negative"
                class="bg-primary text-secondary"
                dense
            >
                <q-tab name="Manual" label="Manual" />
                <q-tab name="Auto" label="Auto" />
            </q-tabs>
            <q-tab-panels v-model="tab" class="bg-info">
                <q-tab-panel name="Manual">
                    <div class="bg-info text-secondary">Mails</div>
                </q-tab-panel>
                <q-tab-panel name="Auto">
                    <div class="bg-info text-secondary">Auto</div>
                </q-tab-panel>
            </q-tab-panels>
        </q-card>
        <div class="row">
            <player-panel class="col"></player-panel>
            <player-panel class="col"></player-panel>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import PlayerPanel from 'src/components/PlayerPanel.vue';

const tab = ref('mails');

const sampleText = ref(`2nd Draft of Game`);

</script>

<style scoped>
</style>
