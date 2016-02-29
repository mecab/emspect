//eshint: esnext: true, node: true;

"use strict";

var fs = require('fs');
var request = require('request');
var $ = require('cheerio');
var Enumerable = require('linq');

function update() {
    return new Promise((resolve, reject) => {
        request("http://unicode.org/emoji/charts/full-emoji-list.html", (err, res, body) => {
            if (err)
                reject(err);
            if (res.statusCode != 200)
                reject(new Error(`res.statusCode == ${res.statusCode}`));

            var $emojis = $(body)
                    .find('tr');
                
            var emojis = Enumerable.from($emojis)
                    .select((el) => { return $(el); })
                    .where(($el) => { return $el.find('.code').text(); })
                    .select(($el) => {
                        var annotations = Enumerable.from($($el).find('.name').eq(1).find('a'))
                                .select((el) => {
                                    return $(el).text();
                                })
                                .toArray();

                        return {
                            code: $el.find('.code').text(),
                            chars: $el.find('.chars').text(),
                            name: $el.find('.name').eq(0).text(),
                            age: $el.find('.age').text(),
                            default: $el.find('.default').text(),
                            annotations: annotations
                        }
                    })
                    .toArray();

            fs.writeFile('emojiData.json', JSON.stringify(emojis), 'utf-8', (err, res) => {
                if (err) reject(err);
                resolve(emojis);
            });
        });
    });
}

module.exports = {
    Emojis: require('./lib/Emojis'),
    EmojiSearchResult: require('./lib/EmojiSearchResult'),
    update: update
}
