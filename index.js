//eshint: esnext: true, node: true;

"use strict";

var fs = require('fs');
var request = require('request');
var $ = require('cheerio');
var Enumerable = require('linq');

function _joinEmojitoGemoji(emojis, gemojis) {
    var joined = Enumerable.from(emojis)
            .groupJoin(
                gemojis,
                "$.chars",
                "$.emoji",
                (e, g) => {
                    var aliases = g.select('$.aliases')
                            .firstOrDefault("$", []);
                    return Object.assign(e, { aliases: aliases });
                })
            .toArray();

    return joined;
}

function update() {
    var requestFullEmojiListPromise = new Promise((resolve, reject) => {
        request("http://unicode.org/emoji/charts/full-emoji-list.html", (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }
            if (res.statusCode != 200) {
                reject(`res.statusCode == ${res.statusCode}`);
                return;
            }

            resolve(body);
        });
    });

    var requestGemojiJsonPromise = new Promise((resolve, reject) => {
        request("https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json", (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }
            if (res.statusCode != 200) {
                reject(`res.statusCode == ${res.statusCode}`);
                return;
            }

            resolve(JSON.parse(body));
        });
    });

    function parseFullEmojiBody(body) {
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

                    var nameSynonym = $el.find('.name').eq(0).text().split("≊ ");
                    var name = nameSynonym[0];
                    var synonym = nameSynonym[1] || null;

                    return {
                        code: $el.find('.code').text(),
                        chars: $el.find('.chars').text(),
                        name: name,
                        synonym: synonym,
                        age: $el.find('.age').text(),
                        default: $el.find('.default').text(),
                        annotations: annotations
                    }
                })
                .toArray();

        return emojis;
    }

    return Promise.all([requestFullEmojiListPromise,
                        requestGemojiJsonPromise])
        .then((full_gemojiData) => {
            var full = full_gemojiData[0];
            var gemojiData = full_gemojiData[1];

            var emojis = parseFullEmojiBody(full);
            var data = _joinEmojitoGemoji(emojis, gemojiData);

            fs.writeFile('emojiData.json', JSON.stringify(data), 'utf-8', (err, res) => {
                if (err) Promise.reject(err);
                return Promise.resolve(data);
            });
        });
}

module.exports = {
    Emojis: require('./lib/Emojis'),
    EmojiSearchResult: require('./lib/EmojiSearchResult'),
    update: update,
    _joinEmojitoGemoji: _joinEmojitoGemoji
}
