import { formatScripture, parseScripture, hasMultipleVerses, formatMultipleVerseQuote, getVerseRange, getBookNumber, getQuoteSortId, reduceVerseListToVerseRangeArray, verseRangeArrayToString } from './parseScripture';

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

describe('getVerseRange', () => {

    it('can get verse range from multiple verse quotes', () => {
        const sample = "Three 2:4 Four 2:5 Five 2:6 Six";
        expect(getVerseRange(2, 3, sample)).toBe('3-6');
    })

    it('can parse non continuous verses into a verseRange reference', () => {

        let sample = "For I am... 11:4 For if he ... 11:5 For I suppose ... 11:7 Have I committed ...?";

        let expected = "2,4-5,7";

        expect(getVerseRange(11, 2, sample)).toBe(expected);

    })

    it('returns starting verse if no subsequent verses quoted', () => {
        expect(getVerseRange(11, 2, 'quoted text')).toBe('2');
    })
})

test('We can get book numbers', () => {
    expect(getBookNumber("Genesis")).toBe(1);
    expect(getBookNumber("Revelation")).toBe(66);
});

test('We can get sort id for quoted verse', () => {
    expect(getQuoteSortId("1 Timothy", 2, 3)).toBe(54.002);
    expect(getQuoteSortId("1 Timothy", 2, 12)).toBe(54.0021);
    expect(getQuoteSortId("Psalms", 119, 176)).toBe(19.1192);
    expect(getQuoteSortId("Psalms", 110, 4)).toBe(19.110);
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
        .toBe('62.0010,"1 John 1:1","This is the scripture"');
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

describe('reduceVerseListToVerseRangeArray', () => {

    it('returns "[[1,2]]" for [1,2]', () => {
        expect(reduceVerseListToVerseRangeArray([1, 2])).toEqual(expect.arrayContaining([[1, 2]]));
    })

    it('returns "[[1,3]]" for [1,2,3]', () => {
        expect(reduceVerseListToVerseRangeArray([1, 2, 3])).toEqual(expect.arrayContaining([[1, 3]]));
    })

    it('returns array of ranges and values describing list of chapter verse numbers', () => {
        expect(reduceVerseListToVerseRangeArray([1, 2, 3, 5, 7, 8])).toEqual(expect.arrayContaining([[1, 3], 5, [7, 8]]));
    })
})

describe('verseRangeArrayToString', () => {

    it('returns string representing verse range array', () => {
        expect(verseRangeArrayToString([[1, 2]])).toBe('1-2');
        expect(verseRangeArrayToString([[1, 3], 5])).toBe('1-3,5');
        expect(verseRangeArrayToString([[1, 3], 5, [7, 8]])).toBe('1-3,5,7-8');
    })
})

//Reproducing problem found using front end
test('We can handle Psalm 110v4 reference from verse text for book chapter and verse', () => {
    expect(
        parseScripture("Psalms 110:4 The LORD hath sworn, and will not repent, Thou art a priest for ever after the order of Melchizedek.")
    ).toEqual(
        expect.arrayContaining(
            [
                19.110,
                "Psalms",
                "110",
                "4",
                "The LORD hath sworn, and will not repent, Thou art a priest for ever after the order of Melchizedek."
            ])
    );
});

//Reproducing problem found using front end
test('We can get formatted string from Psalm 110v4', () => {
    expect(formatScripture("Psalms 110:4 The LORD hath sworn, and will not repent, Thou art a priest for ever after the order of Melchizedek."))
        .toBe('19.1100,"Psalms 110:4","The LORD hath sworn, and will not repent, Thou art a priest for ever after the order of Melchizedek."');
});

//Reproducing problem found using front end
test('We can handle Exodus 30v6 reference from verse text for book chapter and verse', () => {
    expect(
        parseScripture("Exodus 30:6 And thou shalt put it before the vail that is by the ark of the testimony, before the mercy seat that is over the testimony, where I will meet with thee.")
    ).toEqual(
        expect.arrayContaining(
            [
                2.030,
                "Exodus",
                "30",
                "6",
                "And thou shalt put it before the vail that is by the ark of the testimony, before the mercy seat that is over the testimony, where I will meet with thee."
            ])
    );
});