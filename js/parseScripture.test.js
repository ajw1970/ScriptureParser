const { test, expect } = require('@jest/globals');
const parseScripture = require('./parseScripture');

test('We can parse out reference from verse text', () => {
    expect(
        parseScripture("Proverbs 12:17 He that speaketh truth sheweth forth righteousness: but a false witness deceit.")
    ).toBe([
        "Proverbs 12:17",
        "He that speaketh truth sheweth forth righteousness: but a false witness deceit."
    ])
})