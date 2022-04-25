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
    const matches = quoteText.match(regExp);
    if (!matches || matches.length === 1) {
        return firstVerse;
    }
    const lastVerseWithChapter = matches[matches.length - 1];
    const lastVerse = lastVerseWithChapter.split(':')[1].trim();
    return `${firstVerse}-${lastVerse}`;
}

function getBookNumber(book) {
    return getKjvBooks().indexOf(book) + 1;
}

function getQuoteSortId(book, chapter, firstVerse) {
    const bookNumber = getBookNumber(book);
    var sortId = bookNumber + chapter / 1000;
    var verseDigits = firstVerse.toString().length;
    sortId += (verseDigits - 1) / 10000;
    return Math.round(sortId * 10000) / 10000;
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

module.exports = { parseScripture, hasMultipleVerses, formatMultipleVerseQuote, getVerseRange, getBookNumber, getQuoteSortId };