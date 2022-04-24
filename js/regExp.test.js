const { test, expect } = require("@jest/globals");

test('We know how to use RegExp', () => {
    const text = "Three 2:4 Four 2:5 Five 2:6 Six";

    var re = new RegExp(' 2:(\\d+) ', 'g');

    var match = text.replace(re, '\n$1 ');

    expect(match).toBe(`Three
4 Four
5 Five
6 Six`);
});