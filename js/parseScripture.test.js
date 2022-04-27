const { test, expect } = require('@jest/globals');
const { formatScripture, parseScripture, hasMultipleVerses, formatMultipleVerseQuote, getVerseRange, getBookNumber, getQuoteSortId } = require('./parseScripture');

test('We can parse out reference from verse text for book chapter and verse', () => {
    expect(
        parseScripture("Proverbs 12:17 He that speaketh truth sheweth forth righteousness: but a false witness deceit.")
    ).toEqual(
        expect.arrayContaining(
            [
                20.0121,
                "Proverbs",
                "12",
                "17",
                "He that speaketh truth sheweth forth righteousness: but a false witness deceit."
            ])
    );
});

test('We can parse out reference from verse text for numbered book', () => {
    expect(
        parseScripture("2 Kings 8:19 Yet the LORD would not destroy Judah for David his servant's sake, as he promised him to give him alway a light, and to his children.")
    ).toEqual(
        expect.arrayContaining(
            [
                12.0081,
                "2 Kings",
                "8",
                "19",
                "Yet the LORD would not destroy Judah for David his servant's sake, as he promised him to give him alway a light, and to his children."
            ])
    );
});

test('We can parse out reference range', () => {
    expect(
        parseScripture("1 Timothy 2:3 For this is good and acceptable in the sight of God our Saviour; 2:4 Who will have all men to be saved, and to come unto the knowledge of the truth. 2:5 For there is one God, and one mediator between God and men, the man Christ Jesus; 2:6 Who gave himself a ransom for all, to be testified in due time.")
    ).toEqual(
        expect.arrayContaining(
            [
                54.002,
                "1 Timothy",
                "2",
                "3-6",
                `3 For this is good and acceptable in the sight of God our Saviour;
4 Who will have all men to be saved, and to come unto the knowledge of the truth.
5 For there is one God, and one mediator between God and men, the man Christ Jesus;
6 Who gave himself a ransom for all, to be testified in due time.`
            ])
    );
});

test('We can identify quotes with multiple verses', () => {
    const sample = "Three 2:4 Four 2:5 Five 2:6 Six";
    expect(hasMultipleVerses(2, sample)).toBe(true);
});

test('We can identify quotes of a single verse', () => {
    const sample = "This is the verse text.";
    expect(hasMultipleVerses(2, sample)).toBe(false);
});

test('We can format multiple verse quotes', () => {
    const sample = "Three 2:4 Four 2:5 Five 2:6 Six";
    const sampleFormatted = `3 Three
4 Four
5 Five
6 Six`

    expect(formatMultipleVerseQuote(2, 3, sample)).toBe(sampleFormatted);
});

test('We can get verse range from multiple verse quotes', () => {
    const sample = "Three 2:4 Four 2:5 Five 2:6 Six";
    expect(getVerseRange(2, 3, sample)).toBe('3-6');
});

test('We can get book numbers', () => {
    expect(getBookNumber("Genesis")).toBe(1);
    expect(getBookNumber("Revelation")).toBe(66);
});

test('We can get sort id for quoted verse', () => {
    expect(getQuoteSortId("1 Timothy", 2, 3)).toBe(54.002);
    expect(getQuoteSortId("1 Timothy", 2, 12)).toBe(54.0021);
    expect(getQuoteSortId("Psalms", 119, 176)).toBe(19.1192);
});

test('We can turn a block of text into lines', () => {
    var text = `Line 1
Line 2
Line 3`;
    var lines = text.split(/\r\n|\n/);

    expect(lines.length).toBe(3);
});

test('We can get formatted string from quoted verse', () => {
    expect(formatScripture("1 John 1:1 This is the scripture"))
        .toBe('62.001,"1 John 1:1","This is the scripture"');
});