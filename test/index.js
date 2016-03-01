//jshint esnext: true, node: true

var Enumerable = require('linq');
var assert = require('chai').assert
var emspect = require('../index.js')

var gemojis = [
    {
        emoji: "😄",
        description: "smiling face with open mouth and smiling eyes",
        aliases: [ "smile" ],
        tags: [ "happy", "joy", "pleased" ]
    },
    {
        emoji: "😃",
        description: "smiling face with open mouth",
        aliases: [ "smiley" ],
        tags: [ "happy", "joy", "haha" ]
    }
];

var emojis = [
    {
        code: "U+1F604",
        chars: "😄",
        name: "SMILING FACE WITH OPEN MOUTH AND SMILING EYES",
        synonym: null,
        age: "2010ʲ",
        default: "emoji",
        annotations: ["eye","face","mouth","open","person","smile"]
    },
    {
        code: "U+1F603",
        chars: "😃",
        name: "SMILING FACE WITH OPEN MOUTH",
        synonym: null,
        age: "2010ʲ",
        default: "emoji",
        annotations: ["face","mouth","open","person","smile"]
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
];

describe("_joinEmojitoGemoji", function() {
    var joined;

    before(function() {
        joined = emspect._joinEmojitoGemoji(emojis, gemojis);
    });

    it('😄 got alias: `[ "smile" ]`', function() {
        var e = Enumerable.from(joined)
                .first("$.code === 'U+1F604'")

        assert.deepEqual(e, {
            code: "U+1F604",
            chars: "😄",
            name: "SMILING FACE WITH OPEN MOUTH AND SMILING EYES",
            synonym: null,
            age: "2010ʲ",
            default: "emoji",
            annotations: ["eye","face","mouth","open","person","smile"],
            aliases: [ "smile" ]
        });
    });

    it('😃 got alias: `[ "smiley" ]`', function() {
        var e = Enumerable.from(joined)
                .first("$.code === 'U+1F603'")

        assert.deepEqual(e, {
            code: "U+1F603",
            chars: "😃",
            name: "SMILING FACE WITH OPEN MOUTH",
            synonym: null,
            age: "2010ʲ",
            default: "emoji",
            annotations: ["face","mouth","open","person","smile"],
            aliases: [ "smiley" ]
        });
    });

    it('🅰️ got alias: `[ ]`', function() {
        var e = Enumerable.from(joined)
                .first("$.code === 'U+1F170'")

        assert.deepEqual(e, {
            code: "U+1F170",
            chars: "🅰️",
            name: "NEGATIVE SQUARED LATIN CAPITAL LETTER A",
            synonim: "a button",
            age: "2010ʲ",
            default: "text*",
            annotations: ["a","blood","symbol","word"],
            aliases: []
        })
    });
});
