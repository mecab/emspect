"use strict";

var Enumerable = require('linq');

var EmojiSearchResult = (function() {
    function EmojiSearchResult(data) {
        this.prototype = Object.assign(this, data);
    }

    EmojiSearchResult.prototype.toData = function() {
        return Enumerable.from(Object.keys(this))
            .where('$ !== "prototype" ')
            .select((key) => {
                return { key: key, value: this[key] };
            })
            .toObject('$.key', '$.value');
    };

    EmojiSearchResult.prototype.format = function(fmt) {
        if (!fmt) {
            return this.formatSimple();
        }

        if (fmt === "all") {
            return this.formatAll();
        }

        var addColons = (e) => {
            return `:${e}:`;
        };

        var fmtAry = fmt.split('\\%');
        var result = Enumerable.from(fmtAry)
                .select((fmt) => {
                    fmt = fmt.replace(/\%c/g, this.code);
                    fmt = fmt.replace(/\%C/g, this.chars);
                    fmt = fmt.replace(/\%n/g, this.name);
                    fmt = fmt.replace(/\%s/g, this.synonym || "");
                    fmt = fmt.replace(/\%\?s\((.+?)\)/g, this.synonym ? "$1" : "");
                    fmt = fmt.replace(/\%S/g, this.synonym ? "≊ " + this.synonym : "");
                    fmt = fmt.replace(/\%y/g, this.age);
                    fmt = fmt.replace(/\%d/g, this.default);
                    fmt = fmt.replace(/\%a/g, this.annotations.join(", "));
                    fmt = fmt.replace(/\%g/g, this.aliases.join(", "));
                    fmt = fmt.replace(/\%\?g\((.+?)\)/g, this.aliases.length > 0 ? "$1" : "");
                    fmt = fmt.replace(/\%G/g, Enumerable.from(this.aliases)
                                      .select((s) => { return addColons(s); })
                                      .toArray()
                                      .join(", "));
                    return fmt;
                })
                .toArray()
                .join('$');

        return result;
    };

    EmojiSearchResult.prototype.formatSimple = function() {
        return this.format('%C %n %S%?s( )(%c) - %a%?g( )%G');
    };

    EmojiSearchResult.prototype.formatAll = function() {
        return this.format('%c\t%C\t%n\t%s\t%y\t%d\t%a\t%G');
    };

    EmojiSearchResult.prototype.formatJson = function() {
        var data = this.toData();
        return JSON.stringify(data);
    };

    return EmojiSearchResult;
})();

module.exports = EmojiSearchResult;

