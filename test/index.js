//jshint esnext: true, node: true

var path = require('path');
var baseDir = path.resolve(path.join(__dirname, '..'));
var opt = {};
opt[baseDir] = {}
var mockFs = (require('mock-fs')).fs(opt);

var Enumerable = require('linq');
var assert = require('chai').assert;
var proxyquire = require('proxyquire');
var emspect = proxyquire(
    '../index.js',
    {
        request: require('./mock/request'),
        fs: mockFs
    });

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
        synonym: "a button",
        age: "2010ʲ",
        default: "text*",
        annotations: ["a","blood","symbol","word"]
    }
];

var expectJoined = [
    {
        code: "U+1F603",
        chars: "😃",
        name: "SMILING FACE WITH OPEN MOUTH",
        synonym: null,
        age: "2010ʲ",
        default: "emoji",
        annotations: ["face","mouth","open","person","smile"],
        aliases: [ "smiley" ]
    },
    {
        code: "U+1F604",
        chars: "😄",
        name: "SMILING FACE WITH OPEN MOUTH AND SMILING EYES",
        synonym: null,
        age: "2010ʲ",
        default: "emoji",
        annotations: ["eye","face","mouth","open","person","smile"],
        aliases: [ "smile" ]
    },
    {
        code: "U+1F170",
        chars: "🅰️",
        name: "NEGATIVE SQUARED LATIN CAPITAL LETTER A",
        synonym: "a button",
        age: "2010ʲ",
        default: "text*",
        annotations: ["a","blood","symbol","word"],
        aliases: []
    }
];

describe("_joinEmojitoGemoji", function() {
    var joined;

    before(function() {
        joined = emspect._joinEmojitoGemoji(emojis, gemojis);
    });

    it('😄 got alias: `[ "smile" ]`', function() {
        var actual = Enumerable.from(joined)
                .first("$.code === 'U+1F604'");

        var expected = Enumerable.from(expectJoined)
                .first("$.code === 'U+1F604'");

        assert.deepEqual(actual, expected);
    });

    it('😃 got alias: `[ "smiley" ]`', function() {
        var actual = Enumerable.from(joined)
                .first("$.code === 'U+1F603'")

        var expected = Enumerable.from(expectJoined)
                .first("$.code === 'U+1F603'");

        assert.deepEqual(actual, expected);
    });

    it('🅰️ got alias: `[ ]`', function() {
        var actual = Enumerable.from(joined)
                .first("$.code === 'U+1F170'")

        var expected = Enumerable.from(expectJoined)
                .first("$.code === 'U+1F170'");

        assert.deepEqual(actual, expected)
    });
});

describe("update()", function() {
    it("download `full-emoji-list.html` and `emoji.json` then create `emojiData.json`", function() {
        return emspect.update()
            .then(() => {
                var written = mockFs.readFileSync(
                    path.join(__dirname, '../', 'emojiData.json'),
                    'utf-8'
                );

                written = JSON.parse(written);
                assert.deepEqual(written, expectJoined);
            });
    });
});
