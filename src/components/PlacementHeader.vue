<template>
    <div>
        <div v-if="!placementConfirmed">
            <q-card>
                <q-tabs
                    v-model="tab"
                    active-color="bg-negative"
                    class="bg-primary text-secondary"
                    dense
                >
                    <q-tab name="auto"     label="Auto"/>
                    <q-tab name="manual"   label="Manual"/>
                </q-tabs>
                <q-tab-panels v-model="tab" class="bg-info">
                    <q-tab-panel name="auto">
                        <div class="bg-info text-secondary">
                            <p>Press button to auto place all ships.</p>
                            <custom-q-btn
                                @click="autoPlace"
                                label="Auto Place"
                                :disabled=isFullPlacement
                            />
                        </div>
                    </q-tab-panel>
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
                                    :label=manualDirectionDisplay
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
        </div>
    </div>
</template>

<script setup>
tab
custom-q-btn
isFullPlacement
shipsArray
shipSelect
manualDirectionDisplay
rotate
clearPlacement
confirmPlacement
</script>

<style scoped>
buttonRow
</style>