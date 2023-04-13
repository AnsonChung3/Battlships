<template>
    <q-btn
        :text-color=textCompu
        :color=colorCompu
    >
        <q-tooltip
            anchor="top middle"
            self="top middle"
            :offset="[30, 30]"
        >{{ shipLength }} tile</q-tooltip>
    </q-btn>
</template>

<script setup>
import { toRef, computed } from 'vue';
const props = defineProps({
    shipState: Boolean,
    shipLength: Number
});
const stateRef = toRef(props, 'shipState');
const colorCompu = computed(() => stateRef.value ? 'secondary' : 'primary');
const textCompu = computed(() => stateRef.value ? 'warning' : 'secondary');
</script>
