// -*- coding: utf-8 -*-
//jshint: esnext: true, node:true

"use strict";

var path = require('path');
var fs = require('fs');

function getFixturePath(name) {
    return path.join(__dirname, '../', 'fixture', name)
}

function request(url, cb) {
    var fixturePath;
    if (/full-emoji-list.html$/.test(url)) {
        var fixturePath = getFixturePath('full-emoji-list.html');
    }
    else if (/emoji.json$/.test(url)) {
        var fixturePath = getFixturePath('emoji.json');
    }

    var data = fs.readFileSync(fixturePath, 'utf-8');
    cb(null, { statusCode: 200 }, data);
}

module.exports = request;
