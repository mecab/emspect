// -*- coding: utf-8 -*-
//jshint: esnext: true, node:true

"use strict";

var path = require('path');
var fs = require('fs');

var fullEmojiListFilename = "full-emoji-list.html";
var emojiJsonFilename = "emoji.json";

function getFixturePath(name) {
    return path.join(__dirname, '../', 'fixture', name)
}

function request(url, cb) {
    var fixturePath;
    if (/full-emoji-list.html$/.test(url)) {
        var fixturePath = getFixturePath(fullEmojiListFilename);
    }
    else if (/emoji.json$/.test(url)) {
        var fixturePath = getFixturePath(emojiJsonFilename);
    }

    var data = fs.readFileSync(fixturePath, 'utf-8');
    cb(null, { statusCode: 200 }, data);
}

function setFullEmojiListFilename(newFilename) {
    fullEmojiListFilename = newFilename;
}

function setEmojiJsonFilename(newFilename) {
    emojiJsonFilename = newFilename;
}

module.exports = {
    request: request,
    setFullEmojiListFilename: setFullEmojiListFilename,
    setEmojiJsonFilename: setEmojiJsonFilename
}
