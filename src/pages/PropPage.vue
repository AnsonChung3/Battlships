<template>
    <div>
        <h1>Hi, this is Battleship.</h1>
        <h2>test val = {{ testVal }}</h2>
        <h2 v-for="(value, key) in testObj" :key="key">
            {{ key }} : {{ value }}
        </h2>
        <q-btn
            label="test increment"
            @click="increment"
        />
        <q-btn
            label="dynamic player"
            @click="testPlayer"
        />
    </div>
</template>

<script setup>
import { toRef, toRefs } from 'vue';
import { increment, testPlayer } from 'components/TestHelper.js';

import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();
const testVal = toRef(store, 'testVal');
const testObj = toRefs(store.testObj);
</script>
