<template>
    <div>
        <q-card>
            <q-tabs
                v-model="tab"
                active-color="bg-negative"
                class="bg-1imary text-secondary"
                dense
            >
                <q-tab name="auto"     label="Auto"/>
                <q-tab name="manual"   label="Manual"/>
            </q-tabs>
            <q-tab-panels v-model="tab" class="bg-info">
                <q-tab-panel name="auto">
                    <div class="bg-info text-secondary">
                        <p>Press button to auto place all ships.</p>
                        <p>1 x 5-tile ship, 1 x 4-tile ship, 2 x 3-tile ship, 2 x 2-tile ship, 2 x 1-tile ship</p>
                        <custom-q-btn
                            @click="autoPlace"
                            label="Auto Place"
                            :disabled=isFullPlacement
                        />
                    </div>
                </q-tab-panel>
                <!-- manual mode will be worked on when auto mode is finished modding -->
                <q-tab-panel name="manual">
                    <div class="bg-info text-secondary">
                        <p>Pick the size of ship you want to place</p>
                        <custom-q-btn
                            v-for="(ship) in shipsArray" :key="ship.ID"
                            @click="shipSelect(ship.ID)"
                            :label=ship.len
                            :disabled="ship.isSet"
                            class="buttonRow"
                        />
                        <p>
                            <!-- click or press R to rotate -->
                            Click to rotate:
                            <custom-q-btn
                                @click="rotate"
                                :label=directionDisplay
                                class="buttonRow"
                            />
                        </p>
                    </div>
                </q-tab-panel>
            </q-tab-panels>
        </q-card>
        <div>
            <custom-q-btn
                @click="clearPlacement"
                label="Clear Placement"
            />
            <custom-q-btn
                :disabled=!isFullPlacement
                @click="confirmPlacement"
                label="Confirm Placement"
            />
        </div>
        <placement-auto v-if="tab==='auto'"/>
        <placement-manual v-else/>
    </div>
</template>

<script setup>
import { ref, watch, computed, toRef, toRefs } from 'vue';
import CustomQBtn from 'src/components/CustomQBtn.vue';
import PlacementAuto from 'components/PlacementAuto.vue';
import PlacementManual from 'components/PlacementManual.vue';
import { autoPlace, resetSelectedID } from 'components/helpers.js';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const STATES = store.STATES;

const p1Active = toRef(store, 'p1Active');
const player = p1Active.value ? toRefs(store.p1) : toRefs(store.p2);
const gridArray = player.grid;
const shipsArray = player.ships;

const tab = ref('auto');
// watcher seems working fine. Check if problem
watch(tab, (newtab) => {
    clearPlacement();
});

const directionDisplay = computed(() => store.manualGoRight ? 'Right' : 'Down');
function rotate () {
    store.manualGoRight = !store.manualGoRight;
};
function shipSelect (ID) {
    store.manualSelectID = ID;
};

const isFullPlacement = computed(() => shipsArray.value.every((ship) => ship.isSet));
function clearPlacement () {
    gridArray.value.forEach(row => row.forEach(cell => {
        cell.display = STATES.BLANK;
        cell.placement = STATES.BLANK;
        cell.ID = 0;
    }));
    shipsArray.value.forEach(ship => { ship.isSet = false; });
    resetSelectedID();
}
function confirmPlacement () {
    player.placementConfirmed.value = true;
    p1Active.value = !p1Active.value;
    resetSelectedID();
}
</script>
