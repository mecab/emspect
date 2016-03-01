//jshint esnext: true, node: true

var fs = require('fs');
var assert = require('chai').assert
var Emojis = require('../index.js').Emojis
var EmojiSearchResult = require('../index.js').EmojiSearchResult

var emojis = new Emojis(
    [
        {
            code: "U+0030 U+20E3",
            chars: "0️⃣",
            name: "Keycap DIGIT ZERO",
            age: "2000",
            default: "text*",
            annotations: ["0", "keycap", "symbol", "word", "zero"]
        },
        {
            code: "U+0031 U+20E3",
            chars:"1️⃣",
            name: "Keycap DIGIT ONE",
            age: "2000",
            default: "text*",
            annotations: ["1", "keycap", "symbol", "word", "one"]
        },
        {
            code: "U+1F170",
            chars: "🅰️",
            name: "NEGATIVE SQUARED LATIN CAPITAL LETTER A",
            synonim: "a button",
            age: "2010ʲ",
            default: "text*",
            annotations: ["a","blood","symbol","word"]
        }
    ]);

describe("Emojis.searchFunctionForQuery", () => {
    it("returns searchByCode() for `U+1F600`", () => {
        assert.equal(emojis.searchFunctionForQuery("U+1F600"),
                     emojis.searchByCode);
    });

    it("returns searchByChars() for `😀`", () => {
        assert.equal(emojis.searchFunctionForQuery("😀"),
                     emojis.searchByChars);
    });

    it("returns searchByName() for `GRINNING FACE`", () => {
        assert.equal(emojis.searchFunctionForQuery("GRINNING FACE"),
                     emojis.searchByName);
    });

    it("returns searchByName() for `TYPE-1`", () => {
        assert.equal(emojis.searchFunctionForQuery("TYPE-1"),
                     emojis.searchByName);
    });

    it("returns searchByAnnotations() for `face`", () => {
        assert.equal(emojis.searchFunctionForQuery("face"),
                     emojis.searchByAnnotations);
    });

    it("returns searchByAnnotations() for `grinning, face`", () => {
        assert.equal(emojis.searchFunctionForQuery("face"),
                     emojis.searchByAnnotations);
    });

    it("returns searchByAnnotations() for `0`", () => {
        assert.equal(emojis.searchFunctionForQuery("0"),
                     emojis.searchByAnnotations);
    });

    it("returns searchByChars() for `0️⃣", () => {
        assert.equal(emojis.searchFunctionForQuery("0️⃣"),
                     emojis.searchByChars);
    });
});

describe("Emojis.searchByCode", () => {
    it("returns 0️⃣ for `U+0030 U+20E3`", () => {
        assert.equal(emojis.searchByCode("U+0030 U+20E3").length, 1);
        assert.equal(emojis.searchByCode("U+0030 U+20E3")[0].chars, "0️⃣");
    });

    it("returns 0️⃣ for `U+0030`", () => {
        assert.equal(emojis.searchByCode("U+0030").length, 1);
        assert.equal(emojis.searchByCode("U+0030")[0].chars, "0️⃣");
    });

    it("returns 0️⃣ , 1️⃣for `U+20E3`", () => {
        assert.equal(emojis.searchByCode("U+20E3").length, 2);
        assert.equal(emojis.searchByCode("U+20E3")[0].chars, "0️⃣");
        assert.equal(emojis.searchByCode("U+20E3")[1].chars, "1️⃣");
    });

    it("returns [] for `U+1111`", () => {
        assert.equal(emojis.searchByCode("U+1111").length, 0);
    });
});

describe("Emojis.searchByChars", () => {
    it("returns 0️⃣  for `0️⃣`", () => {
        assert.equal(emojis.searchByChars("0️⃣").length, 1);
        assert.equal(emojis.searchByChars("0️⃣")[0].chars, "0️⃣");
    });

    it("returns 1️⃣  for `1️⃣`", () => {
        assert.equal(emojis.searchByChars("1️⃣").length, 1);
        assert.equal(emojis.searchByChars("1️⃣")[0].chars, "1️⃣");
    });

    it("returns [] for `😢`", () => {
        assert.equal(emojis.searchByChars("😢").length, 0);
    });
});

describe("Emojis.searchByName", () => {
    it("returns 0️⃣  for `Keycap DIGIT ZERO`", () => {
        assert.equal(emojis.searchByName("Keycap DIGIT ZERO").length, 1);
        assert.equal(emojis.searchByName("Keycap DIGIT ZERO")[0].chars, "0️⃣");
    });

    it("returns 0️⃣  for `KEYCAP DIGIT ZERO` (case-independent)", () => {
        assert.equal(emojis.searchByName("KEYCAP DIGIT ZERO").length, 1);
        assert.equal(emojis.searchByName("KEYCAP DIGIT ZERO")[0].chars, "0️⃣");
    });

    it("returns 0️⃣ , 1️⃣ for `KEYCAP DIGIT`", () => {
        assert.equal(emojis.searchByName("KEYCAP DIGIT").length, 2);
        assert.equal(emojis.searchByName("KEYCAP DIGIT")[0].chars, "0️⃣");
        assert.equal(emojis.searchByName("KEYCAP DIGIT")[1].chars, "1️⃣");
    });

    it("returns []  for `KEYCAP ZERO` (match exactly)", () => {
        assert.equal(emojis.searchByName("KEYCAP ZERO").length, 0);
    });

    it("returns 🅰️  for `A BUTTON` (match for synonym)", () => {
        assert.equal(emojis.searchByName("KEYCAP ZERO").length, 0);
    });
});

describe("Emojis.searchByAnnotations", () => {
    it("returns 0️⃣  for `0`", () => {
        assert.equal(emojis.searchByAnnotations("0").length, 1);
        assert.equal(emojis.searchByAnnotations("0")[0].chars, "0️⃣");
    });

    it("returns 0️⃣ , 1️⃣  for `keycap`", () => {
        assert.equal(emojis.searchByAnnotations("keycap").length, 2);
        assert.equal(emojis.searchByAnnotations("keycap")[0].chars, "0️⃣");
        assert.equal(emojis.searchByAnnotations("keycap")[1].chars, "1️⃣");
    });

    it("returns 0️⃣ , 1️⃣  for `Keycap` (case-independent)", () => {
        assert.equal(emojis.searchByAnnotations("Keycap").length, 2);
        assert.equal(emojis.searchByAnnotations("Keycap")[0].chars, "0️⃣");
        assert.equal(emojis.searchByAnnotations("Keycap")[1].chars, "1️⃣");
    });

    it("returns 0️⃣  for `keycap zero` (and-search)", () => {
        assert.equal(emojis.searchByAnnotations("keycap", "zero").length, 1);
        assert.equal(emojis.searchByAnnotations("keycap", "zero")[0].chars, "0️⃣");
    });

    it("returns []  for `not exist`", () => {
        assert.equal(emojis.searchByAnnotations("not exist").length, 0);
    });
});

describe("EmojiSearchResult", () => {
    var e = new EmojiSearchResult({
        code: "U+0030 U+20E3",
        chars: "0️⃣",
        name: "Keycap DIGIT ZERO",
        age: "2000",
        default: "text*",
        annotations: ["0", "keycap", "symbol", "word", "zero"]
    });

    it("formatSimple() returns `0️⃣ Keycap DIGIT ZERO (U+0030 U+20E3) - 0, keycap, symbol, word, zero`", () => {
        assert.equal(e.formatSimple(), "0️⃣ Keycap DIGIT ZERO (U+0030 U+20E3) - 0, keycap, symbol, word, zero");
    });
    
    it("format() is same as formatSimple()", () => {
        assert.equal(e.format(), e.formatSimple());
    });

    it("formatAll() returns `U+0030 U+20E3\t0️⃣\tKeycap DIGIT ZERO\t2000\ttext*\t0, keycap, symbol, word, zero`", () => {
        assert.equal(e.formatAll(), "U+0030 U+20E3\t0️⃣\tKeycap DIGIT ZERO\t2000\ttext*\t0, keycap, symbol, word, zero");
    });

    it("format('all') is same as formatAll()", () => {
        assert.equal(e.format('all'), e.formatAll());
    });

    it("format('%c\t%C\t%n\t%g\t%d\t%a') is same as formatAll()", () => {
        assert.equal(e.format('%c\t%C\t%n\t%g\t%d\t%a'), e.formatAll());
    });

    it("format() works for duplicated format-descriptors; format('%c %c')", () => {
        assert.equal(e.format('%c %c'),
                     "U+0030 U+20E3 U+0030 U+20E3");
    });

    it("format() works for escaped doller; format('%c\%%c')", () => {
        assert.equal(e.format('%c\%%c'),
                     "U+0030 U+20E3%U+0030 U+20E3");
    });

    it("formatJson returns correct JSON", () => {
        assert.deepEqual(JSON.parse(e.formatJson()), {
            code: "U+0030 U+20E3",
            chars: "0️⃣",
            name: "Keycap DIGIT ZERO",
            age: "2000",
            default: "text*",
            annotations: ["0", "keycap", "symbol", "word", "zero"]
        });
    })
});
