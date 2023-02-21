<template>
    <q-btn
        :text-color=textCompu
        :color=colorCompu
    />
</template>

<script setup>
import { toRef, computed } from 'vue';
const props = defineProps({
    shipState: Boolean
});
const stateRef = toRef(props, 'shipState');
const colorCompu = computed(() => stateRef.value ? 'secondary' : 'primary');
const textCompu = computed(() => stateRef.value ? 'warning' : 'secondary');
</script>
