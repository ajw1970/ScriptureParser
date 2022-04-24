function parseScripture(quote) {
    const data = {
        book: "",
        chapter: "",
        verseRange: "",
        text: quote
    }

    const match = quote.match(/^(.*?) (\d+):(\d+) (.*)$/);
    
    switch (match.length) {
        case 5:
            data.book = match[1];
            data.chapter = match[2];
            data.verseRange = match[3];
            data.text = match[4];
            break;
    }
    
    return Object.values(data);
}

module.exports = parseScripture;