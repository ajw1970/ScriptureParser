function parseScripture(quote) {
    var data = {
        book: "",
        chapter: "",
        verseRange: "",
        text: quote
    }

    var match = quote.match(/^(?<book>.*?) (?<chapter>\d+):(?<verseRange>\d+) (?<text>.*)$/);
    
    switch (match.length) {
        case 5:
            data = {
                book: match.groups.book,
                chapter: match.groups.chapter,
                verseRange: match.groups.verseRange,
                text: match.groups.text
            }

            //look for more than one verse in this chapter
            const regExp = new RegExp(` ${data.chapter}:(\\d+) `, 'g');
            if (hasMultipleVerses(data.chapter, data.text)) {
                data.text = formatMultipleVerseQuote(data.chapter, data.verseRange, data.text);
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
    return firstVerse + ' ' + quoteText.replace(regExp, '\n$1 ');
}

module.exports = { parseScripture, hasMultipleVerses, formatMultipleVerseQuote };