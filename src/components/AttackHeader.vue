<template>
    <div>
        <q-card class="bg-info text-secondary">
            <q-card-section>
                <p>Remaining ships</p>
                <!-- some more work to show ship length for each of the ships -->
                <div v-for="(ship) in shipsArray" :key=ship.ID class="inline">
                    <progress-q-btn
                        :label=ship.ID
                        :shipState=ship.isSunk
                    />
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { toRefs, toRef } from 'vue';
import ProgressQBtn from 'src/components/ProgressQBtn.vue';

const props = defineProps({
    p1: Boolean
});
const p1 = toRef(props, 'p1');

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const player = (p1.value === true) ? toRefs(store.p1) : toRefs(store.p2);
const shipsArray = player.ships;
</script>
