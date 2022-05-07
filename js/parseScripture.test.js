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

test('We can parse out reference range for 2 verses', () => {
    expect(
        parseScripture("1 Timothy 2:3 For this is good and acceptable in the sight of God our Saviour; 2:4 Who will have all men to be saved, and to come unto the knowledge of the truth.")
    ).toEqual(
        expect.arrayContaining(
            [
                54.002,
                "1 Timothy",
                "2",
                "3-4",
                `3 For this is good and acceptable in the sight of God our Saviour;
4 Who will have all men to be saved, and to come unto the knowledge of the truth.`
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

test('We can parse csv text into an array', () => {

    // Return array of string values, or NULL if CSV string not well formed.
    /** from: https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data */
    function csvToArray(text) {
        var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text)) return null;
        var a = [];                     // Initialize array to receive values.
        text.replace(re_value, // "Walk" the string using replace with callback.
            function (m0, m1, m2, m3) {
                // Remove backslash from \' in single quoted values.
                if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                // Remove backslash from \" in double quoted values.
                else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                else if (m3 !== undefined) a.push(m3);
                return ''; // Return empty string.
            });
        // Handle special case of empty last value.
        if (/,\s*$/.test(text)) a.push('');
        return a;
    };

    function getLinesFromText(str) {
        return str.split(/\r?\n/);
    }

    let sample = `1.008,Genesis 8:21,"And the LORD smelled a sweet savour; and the LORD said in his heart, I will not again curse the ground any more for man's sake; for the imagination of man's heart is evil from his youth; neither will I again smite any more every thing living, as I have done."`

    let results = csvToArray(sample);

    expect(results.length).toBe(3);

})