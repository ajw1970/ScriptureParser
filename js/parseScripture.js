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
            if (regExp.test(data.text)) {
                data.text = data.text.replace(regExp, '\n$1 ');
                data.text = data.verseRange + ' ' + data.text;
            }
            break;
    }
    
    return Object.values(data);
}

module.exports = parseScripture;