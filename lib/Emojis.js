//eshint: esnext: true, node: true;

"use strict";

var path = require('path');
var fs = require('fs');
var Enumerable = require('linq');
var EmojiSearchResult = require('./EmojiSearchResult');

var Emojis = (function() {
    function Emojis(data) {
        this._emojis = data;
    }

    Emojis.prototype.searchFunctionForQuery = function(query) {
        if (query.startsWith("U+")) {
            return this.searchByCode;
        }
        else if (/^[A-Z][A-Z0-9 \-]+$/.test(query)) {
            return this.searchByName;
        }
        else if (/^[0-9a-z ]+$/.test(query)) {
            return this.searchByAnnotations;
        }
        else if (/^:.+:$/.test(query)) {
            return this.searchByShortcode;
        }
        else if (/^:/.test(query)) {
            return this.searchByShortcodeStartsWith;
        }
        else {
            return this.searchByChars;
        }
    }

    Emojis.prototype.search = function(query) {
        var func = this.searchFunctionForQuery(query);
        if (func == this.searchByAnnotations) {
            query = query.split(/, */);
        }
        else {
            query = [query];
        }
        return func.apply(this, query);
    }

    Emojis.prototype.searchByChars = function(chars) {
        var result = Enumerable.from(this._emojis)
                .where((emoji) => {
                    return emoji.chars == chars;
                })
                .select((e) => { return new EmojiSearchResult(e); })
                .toArray();

        return result;
    }

    Emojis.prototype.searchByCode = function(code) {
        var result = Enumerable.from(this._emojis)
                .where((emoji) => {
                    return emoji.code.indexOf(code) > -1;
                })
                .select((e) => { return new EmojiSearchResult(e); })
                .toArray();

        return result;
    }

    Emojis.prototype.searchByName = function(name) {
        var upperCasedQuery = name.toUpperCase()
        var result = Enumerable.from(this._emojis)
                .where((emoji) => {
                    return emoji.name.toUpperCase().indexOf(upperCasedQuery) > -1 ||
                        (emoji.synonym || "").toUpperCase().indexOf(upperCasedQuery) > -1;
                })
                .select((e) => { return new EmojiSearchResult(e); })
                .toArray();

        return result;
    }

    Emojis.prototype.searchByAnnotations = function(args) {
        var annotations = Array.prototype.slice.call(arguments);
        var result = Enumerable.from(this._emojis);

        Enumerable.from(annotations)
            .select("$.toLowerCase()")
            .forEach((an) => {
                result = result.where((emoji) => {
                    return emoji.annotations.indexOf(an) > -1;
                })
            });

        return result
            .select((e) => { return new EmojiSearchResult(e); })
            .toArray();
    }

    Emojis.prototype.searchByShortcode = function(query) {
        query = query.replace(/:/g, '').toLowerCase();
        var result = Enumerable.from(this._emojis)
                .where((emoji) => {
                    return Enumerable.from(emoji.aliases)
                        .select("$.toLowerCase()")
                        .any((alias) => { return alias === query; })
                })
                .select((e) => { return new EmojiSearchResult(e); })
                .toArray();

        return result;
    }

    Emojis.prototype.searchByShortcodeStartsWith = function(query) {
        query = query.replace(/:/g, '').toLowerCase();
        var result = Enumerable.from(this._emojis)
                .where((emoji) => {
                    return Enumerable.from(emoji.aliases)
                        .select("$.toLowerCase()")
                        .any((alias) => { return alias.startsWith(query); })
                })
                .select((e) => { return new EmojiSearchResult(e); })
                .toArray();

        return result;
    }

    Emojis.createFromFile = function(filename) {
        return new Promise((resolve, reject) => {
            fs.readFile(filename, 'utf8', (err, res) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(new Emojis(JSON.parse(res)));
                })
        });
    };

    Emojis.createFromFileSync = function(filename) {
        var data = fs.readFileSync(filename, 'utf8');
        return new Emojis(JSON.parse(data));
    }

    Emojis.createFromDefaultData = function() {
        return Emojis.createFromFile(
            path.join(__dirname, '../', 'emojiData.json')
        );
    }

    Emojis.createFromDefaultDataSync = function() {
        return Emojis.createFromFileSync(
            path.join(__dirname, '../', 'emojiData.json')
        );
    }

    return Emojis;
})();

module.exports = Emojis;
