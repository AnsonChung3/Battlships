import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBattleshipStore = defineStore('battleship', () => {
    const p1GridArray = ref([])
    const p1ShipsArray = ref([])
    
    const p2GridArray = ref([])
    const p2ShipsArray = ref([])

    const gridWidth = 10
    const shipLengths = [5, 4, 3, 3, 2, 2, 1, 1]
    const STATES = {
        BLANK: 0,
        PLACED: 1,
        MARGIN: 2,
        HIT: 3,
        MISS: 4
    }
    const COLORS = {
        BLANK: '948C15',
        PLACED: '1F9415',
        MARGIN: '13468C',
        HIT: '921313',
        MISS: '383232'
    const shipsArray = ref([])

    function generateShipsArray () {
        shipsArray.value = shipLengths.map((len, index) => {
            return {
                len,
                ID: index + 1,
                isSet: false,
                isSunk: false
            };
        });
    }

    // }
    return { shipsArray, generateShipsArray }
})
