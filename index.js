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

var Emojis = (function() {
    function Emojis(data) {
        this._emojis = data;
    }

    Emojis.prototype.searchFunctionForQuery = function(query) {
        if (query.startsWith("U+")) {
            return this.searchByCode;
        }
        else if (/^[A-Z][A-Z0-9 ]+$/.test(query)) {
            return this.searchByName;
        }
        else if (/^[0-9a-z ]+$/.test(query)) {
            return this.searchByAnnotation;
        }
        else {
            return this.searchByChars;
        }
    }

    Emojis.prototype.search = function(query) {
        return this.searchFunctionForQuery(query).bind(this);
    }

    Emojis.prototype.searchByChars = function(chars) {
        var result = Enumerable.from(this._emojis)
                .where((emoji) => {
                    return emoji.chars == chars;
                })
                .toArray();

        return result;
    }

    Emojis.prototype.searchByCode = function(code) {
        var result = Enumerable.from(this._emojis)
                .where((emoji) => {
                    return emoji.code.indexOf(code) > -1;
                })
                .toArray();

        return result;
    }

    Emojis.prototype.searchByName = function(name) {
        var upperCasedQuery = name.toUpperCase()
        var result = Enumerable.from(this._emojis)
                .where((emoji) => {
                    return emoji.name.toUpperCase().indexOf(upperCasedQuery) > -1;
                })
                .toArray();

        return result;
    }

    Emojis.prototype.searchByAnnotation = function(annotations) {
        var annotationsArray = annotations.split(' ');
        
        var result = Enumerable.from(this._emojis);

        Enumerable.from(annotationsArray)
            .select("$.toLowerCase()")
            .forEach((an) => {
                result = result.where((emoji) => {
                    return emoji.annotations.indexOf(an) > -1;
                })
            });
                
        return result.toArray();
    }
    
    return Emojis;
})();

var EmojiSearchResult = (function() {
    function EmojiSearchResult(data) {
        this.prototype = Object.assign(this, data);
    }

    EmojiSearchResult.prototype.format = function(fmt) {
        if (!fmt) {
            return this.formatSimple();
        }

        if (fmt === "-a") {
            return this.formatAll();
        }

        var fmtAry = fmt.split('\\$');
        var result = Enumerable.from(fmtAry)
                .select((fmt) => {
                    fmt = fmt.replace(/\$c/g, this.code);
                    fmt = fmt.replace(/\$C/g, this.chars);
                    fmt = fmt.replace(/\$n/g, this.name);
                    fmt = fmt.replace(/\$g/g, this.age);
                    fmt = fmt.replace(/\$d/g, this.default);
                    fmt = fmt.replace(/\$a/g, this.annotations.join(", "));

                    return fmt;
                })
            .toArray()
                .join('$');

        return result;
    }

    EmojiSearchResult.prototype.formatSimple = function() {
        return `${this.chars} ${this.name} (${this.code}) - ${this.annotations.join(", ")}`;
    }

    EmojiSearchResult.prototype.formatAll = function() {
        return `${this.code}\t${this.chars}\t${this.name}\t${this.age}\t${this.default}\t${this.annotations.join(", ")}`;
    }

    EmojiSearchResult.prototype.formatJson = function() {
        var keys = Object.keys(this);
        var data = Enumerable.from(keys)
                .where('$ !== "prototype" ')
                .select((key) => {
                    return { key: key, value: this[key] };
                })
                .toObject('$.key', '$.value');
        return JSON.stringify(data);
    }
    
    return EmojiSearchResult;
})();


module.exports = {
    Emojis: Emojis,
    EmojiSearchResult: EmojiSearchResult,
    update: update
}
