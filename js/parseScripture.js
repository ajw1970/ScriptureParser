function parseScripture(quote) {
    const match = quote.match(/^(.*?) (\d+):(\d+) (.*)$/);
    match.shift();
    return match;
}

module.exports = parseScripture;