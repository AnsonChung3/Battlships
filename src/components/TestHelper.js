import { useBattleshipStore } from 'stores/battleship.js';
const store = useBattleshipStore();

export function increment () {
    console.log('calling helper function');
    store.testVal += 10;
    store.testObj.propNum += 5;
    store.testObj.propString = 'string';
    store.testObj.propArray[0][0] = 9;
    store.testObj.propBoolean = !store.testObj.propBoolean;
};

export function testPlayer () {
    console.log('testPlayer');
    const test = store.testObj;
    test.propNum += 10;
}
