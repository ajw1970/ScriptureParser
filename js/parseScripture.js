function formatScripture(quote) {
    var data = parseScripture(quote);
    return `${data[0]},"${data[1]} ${data[2]}:${data[3]}","${data[4]}"`;
}

function parseScripture(quote) {
    var data = {
        sortId: 0,
        book: "",
        chapter: "",
        verseRange: "",
        text: quote
    }

    var match = quote.match(/^(?<book>.*?) (?<chapter>\d+):(?<firstVerse>\d+) (?<text>.*)$/);
    
    switch (match.length) {
        case 5:
            const book = match.groups.book;
            const chapter = match.groups.chapter;
            const firstVerse = match.groups.firstVerse;
            const text = match.groups.text;

            data = {
                sortId: getQuoteSortId(book, chapter, firstVerse),
                book,
                chapter,
                verseRange: firstVerse,
                text
            }

            //look for more than one verse in this chapter
            const regExp = new RegExp(` ${data.chapter}:(\\d+) `, 'g');
            if (hasMultipleVerses(data.chapter, data.text)) {
                data.verseRange = getVerseRange(data.chapter, firstVerse, data.text);
                data.text = formatMultipleVerseQuote(data.chapter, firstVerse, data.text);

            }
            break;
    }
    
    return Object.values(data);
}

function getChapterVerseRegExp(chapter) {
    return new RegExp(` ${chapter}:(\\d+) `, 'g');
}

function hasMultipleVerses(chapter, quoteText) {
    const regExp = getChapterVerseRegExp(chapter);
    return regExp.test(quoteText);
}

function formatMultipleVerseQuote(chapter, firstVerse, quoteText) {
    const regExp = getChapterVerseRegExp(chapter);
    return `${firstVerse} ${quoteText.replace(regExp, '\n$1 ')}`;
}

function getVerseRange(chapter, firstVerse, quoteText) {
    const regExp = getChapterVerseRegExp(chapter);
    const quotedChapterVerses = getChapterAndVerseReferences(quoteText, regExp);
    if (!quotedChapterVerses) {
        //there is just one verse quoted
        return firstVerse;
    }

    const vNumArray = quotedChapterVerses.map(getVersNumFromChapterAndVerse);

    /*
        1,2,3,5,6,8

        1-3,5-6,8
    */

    /* let inRange = false;
    let previous = firstVerse;
    let verseRange = `${previous}`;
    vNumArray.shift();
    vNumArray.forEach(current => {
        if (current - previous === 1) {
            if (inRange === false) {
                //start range delimiter
                verseRange += '-';
            }
            //capture new previous value
            previous = current;
        }
    });
    verseRange += vNumArray[vNumArray.length - 1];

    return verseRange; */

    const lastVerseWithChapter = quotedChapterVerses[quotedChapterVerses.length - 1];
    const lastVerse = lastVerseWithChapter.split(':')[1].trim();
    return `${firstVerse}-${lastVerse}`;

    function getChapterAndVerseReferences(quoteText, regExp) {
        return quoteText.match(regExp);
    }

    function getVersNumFromChapterAndVerse(match) {
        return match.split(':')[1].trim();
    }
}

function getBookNumber(book) {
    return getKjvBooks().indexOf(book) + 1;
}

/*
    sort-id is a floating point number with up to 4 decimal places. 

    1.001 is for any reference from Genesis 1:1-9
    2.0101 is for any reference from Exodus 10:10-99

    the whole number is the book number from 1 (Genesis) to 66 (Revelation). 

    The first 3 digits of the fraction are the chapter number divided by 1000. 

    The 4th digit is the number of digits of the first verse number - 1 
*/
function getQuoteSortId(book, chapter, firstVerse) {

    const bookNumber = getBookNumber(book) * 10000;
    const chapterNumber = chapter * 10;
    const verseWeightNumber = firstVerse.toString().length - 1;

    return (bookNumber + chapterNumber + verseWeightNumber) / 10000;
}

function getKjvBooks() {
    return ['Genesis',
        'Exodus',
        'Leviticus',
        'Numbers',
        'Deuteronomy',
        'Joshua',
        'Judges',
        'Ruth',
        '1 Samuel',
        '2 Samuel',
        '1 Kings',
        '2 Kings',
        '1 Chronicles',
        '2 Chronicles',
        'Ezra',
        'Nehemiah',
        'Esther',
        'Job',
        'Psalms',
        'Proverbs',
        'Ecclesiastes',
        'Song of Solomon',
        'Isaiah',
        'Jeremiah',
        'Lamentations',
        'Ezekiel',
        'Daniel',
        'Hosea',
        'Joel',
        'Amos',
        'Obadiah',
        'Jonah',
        'Micah',
        'Nahum',
        'Habakkuk',
        'Zephaniah',
        'Haggai',
        'Zechariah',
        'Malachi',
        'Matthew',
        'Mark',
        'Luke',
        'John',
        'Acts',
        'Romans',
        '1 Corinthians',
        '2 Corinthians',
        'Galatians',
        'Ephesians',
        'Philippians',
        'Colossians',
        '1 Thessalonians',
        '2 Thessalonians',
        '1 Timothy',
        '2 Timothy',
        'Titus',
        'Philemon',
        'Hebrews',
        'James',
        '1 Peter',
        '2 Peter',
        '1 John',
        '2 John',
        '3 John',
        'Jude',
        'Revelation'];
};

function reduceVerseListToVerseRangeArray(verses) {
    return verses.reduce((prevArray, currVal) => {
        if (prevArray.length === 0) {
            //Replace empty initial array
            return [currVal];
        }

        let lastElem = lastElementOf(prevArray);

        if (Array.isArray(lastElem)) {
            let pval = lastElementOf(lastElem);
            if (currVal - pval === 1) {
                lastElem[1] = currVal;
            } else {
                prevArray.push(currVal);
            }
            return prevArray;
        } else {
            let pval = lastElem;
            if (currVal - pval === 1) {
                prevArray[prevArray.length - 1] = [lastElem, currVal];
            } else {
                prevArray.push(currVal);
            }
            return prevArray;
        }
    }, []);

    function lastElementOf(arr) {
        return arr[arr.length - 1];
    }
}

module.exports = { formatScripture, parseScripture, hasMultipleVerses, formatMultipleVerseQuote, getVerseRange, getBookNumber, getQuoteSortId, reduceVerseListToVerseRangeArray };