<template>
    <div>
        <q-card class="bg-info text-secondary">
            <q-card-section>
                <p>Ships Left</p>
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
// shipsArray
</script>

<style scoped>
/* inline */
</style>