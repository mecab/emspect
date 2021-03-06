"use strict";

var fs = require('fs');
var path = require('path');
var request = require('request');
var $ = require('cheerio');
var Enumerable = require('linq');
var msg = require('emoji-logger');

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
    msg("We will update the database. This might take a while...");

    var requestFullEmojiListPromise = new Promise((resolve, reject) => {
        msg("Retrieving http://unicode.org/emoji/charts/full-emoji-list.html ...");
        request("http://unicode.org/emoji/charts/full-emoji-list.html", (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }
            if (res.statusCode != 200) {
                reject(`res.statusCode == ${res.statusCode}`);
                return;
            }

            msg("Compleated downloading full-emoji-list.html.", 'success');
            resolve(body);
        });
    });

    var requestGemojiJsonPromise = new Promise((resolve, reject) => {
        msg("Retrieving https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json ...");
        request("https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json", (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }
            if (res.statusCode != 200) {
                reject(`res.statusCode == ${res.statusCode}`);
                return;
            }

            msg("Compleated downloading emoji.json", 'success');

            var emojis = JSON.parse(body);

            if (emojis.length === 0) {
                throw new Error("Failed to parse. No data is found in emoji.json. The format might have been changed.");
            }

            msg(`Parsed emoji.json. ${emojis.length} emojis found.`);
            resolve(emojis);
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

                    var res  = {
                        code: $el.find('.code').text(),
                        chars: $el.find('.chars').text(),
                        name: name,
                        synonym: synonym,
                        age: $el.find('.age').text(),
                        default: $el.find('.default').text(),
                        annotations: annotations
                    };

                    if (!res.code || !res.chars || !res.name || !res.age || !res.default) {
                        throw new Error("Failed to parse. The format of full-emoji-list.html might have been changed. Failed object: " + JSON.stringify(res));
                    }

                    return res;
                })
                .toArray();

        if (emojis.length === 0) {
            throw new Error("Failed to parse. No data is found in full-emoji-list.html. The format might have been changed.");
        }

        msg(`Parsed full-emoji-list.html. ${emojis.length} emojis found`);
        return emojis;
    }

    return Promise.all([requestFullEmojiListPromise,
                        requestGemojiJsonPromise])
        .then((full_gemojiData) => {
            var data;
            return new Promise((resolve, reject) => {
                try {
                    var full = full_gemojiData[0];
                    var gemojiData = full_gemojiData[1];

                    var emojis = parseFullEmojiBody(full);
                    data = _joinEmojitoGemoji(emojis, gemojiData);
                }
                catch (err) {
                    reject(err);
                    return;
                }

                msg("Writing emojiData.json...");

                fs.writeFile(path.join(__dirname, 'emojiData.json'), JSON.stringify(data), 'utf-8', (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            });
        })
        .then(() => {
            msg("Done!", "success");
        })
        .catch((err) => {
            msg("Failed...", "error");
            msg(err.message, "error");
            throw err;
        });
}

module.exports = {
    Emojis: require('./lib/Emojis'),
    EmojiSearchResult: require('./lib/EmojiSearchResult'),
    update: update,
    _joinEmojitoGemoji: _joinEmojitoGemoji
};
