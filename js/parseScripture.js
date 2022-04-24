function parseScripture(quote) {
    var data = {
        book: "",
        chapter: "",
        verseRange: "",
        text: quote
    }

    const match = quote.match(/^(?<book>.*?) (?<chapter>\d+):(?<verseRange>\d+) (?<text>.*)$/);
    
    switch (match.length) {
        case 5:
            data = {
                book: match.groups.book,
                chapter: match.groups.chapter,
                verseRange: match.groups.verseRange,
                text: match.groups.text
            }
            break;
    }
    
    return Object.values(data);
}

module.exports = parseScripture;