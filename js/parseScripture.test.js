const { test, expect } = require('@jest/globals');
const parseScripture = require('./parseScripture');

test('We can parse out reference from verse text for book chapter and verse', () => {
    expect(
        parseScripture("Proverbs 12:17 He that speaketh truth sheweth forth righteousness: but a false witness deceit.")
    ).toEqual(
        expect.arrayContaining(["Proverbs 12:17", "He that speaketh truth sheweth forth righteousness: but a false witness deceit."])
    );
});

test('We can parse out reference from verse text for numbered book', () => {
    expect(
        parseScripture("2 Kings 8:19 Yet the LORD would not destroy Judah for David his servant's sake, as he promised him to give him alway a light, and to his children.")
    ).toEqual(
        expect.arrayContaining(["2 Kings 8:19", "Yet the LORD would not destroy Judah for David his servant's sake, as he promised him to give him alway a light, and to his children."])
    );
});