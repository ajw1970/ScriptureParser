const { test, expect } = require('@jest/globals');
const parseScripture = require('./parseScripture');

test('We can parse out reference from verse text for book chapter and verse', () => {
    expect(
        parseScripture("Proverbs 12:17 He that speaketh truth sheweth forth righteousness: but a false witness deceit.")
    ).toEqual(
        expect.arrayContaining(
            [
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