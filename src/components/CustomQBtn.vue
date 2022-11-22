<template>
    <q-btn
        :label=props.labelText
        color="primary"
        text-color="secondary"
    />
</template>

<script setup>
const props = defineProps({
  labelText: String
})
</script>
