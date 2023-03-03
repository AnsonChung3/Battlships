import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBattleshipStore = defineStore('battleship', () => {
    // const p1GridArray = ref([])
    // const p1ShipsArray = ref([])

    // const p2GridArray = ref([])
    // const p2ShipsArray = ref([])

    const gridWidth = 10
    const gridArray = ref([])
    function generateGrid () {
        gridArray.value = [];
        for (let R = 0; R < gridWidth; R++) {
            const rowArray = [];
            for (let C = 0; C < gridWidth; C++) {
                rowArray.push({
                    // coordinate is only for debugging
                    coordinate: `row ${R}, column ${C}`,
                    display: STATES.BLANK,
                    placement: STATES.BLANK,
                    ID: 0,
                    isHit: false
                });
            }
            gridArray.value.push(rowArray);
        }
    }

    const shipLengths = [5, 4, 3, 3, 2, 2, 1, 1]
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

    function autoPlace () {
        console.log('auto place');
    }
    // these 2 enums can stay as is because they have no need for reactivity
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
    }
    return { gridArray, generateGrid, shipsArray, generateShipsArray, autoPlace, STATES, COLORS }
})
