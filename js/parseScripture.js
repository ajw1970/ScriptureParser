function parseScripture(quote) {
    var data = {
        book: "",
        chapter: "",
        verseRange: "",
        text: quote
    }

    var match = quote.match(/^(?<book>.*?) (?<chapter>\d+):(?<firstVerse>\d+) (?<text>.*)$/);
    
    switch (match.length) {
        case 5:
            const firstVerse = match.groups.firstVerse;
            data = {
                book: match.groups.book,
                chapter: match.groups.chapter,
                verseRange: firstVerse,
                text: match.groups.text
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

module.exports = { parseScripture, hasMultipleVerses, formatMultipleVerseQuote, getVerseRange };