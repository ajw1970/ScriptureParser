const { test, expect } = require('@jest/globals');
const cloneArray = require('./cloneArray');

test('properly clones array', () => {
    const array = [1, 3, 4];
    expect(cloneArray(array)).toEqual(array);
    expect(cloneArray(array)).not.toBe(array);
})