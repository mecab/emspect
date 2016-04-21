//jshint esnext: true, node: true

var path = require('path');
var baseDir = path.resolve(path.join(__dirname, '..'));
var opt = {};
opt[baseDir] = {}
var mockFs = (require('mock-fs')).fs(opt);

var Enumerable = require('linq');
var chai = require('chai');
chai.use(require('chai-string'));
var assert = chai.assert;
var proxyquire = require('proxyquire');
var requestMock = require('./mock/request');
var emspect = proxyquire(
    '../index.js',
    {
        request: requestMock.request,
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
    var checkNoOutput = function() {
        try {
            mockFs.statSync(emojiJsonPath);
            assert.fail();
        }
        catch(err) {
            assert.equal(err.code, "ENOENT");
        }
    };
    var emojiJsonPath = path.join(__dirname, '../', 'emojiData.json');

    afterEach(function() {
        try {
            mockFs.unlinkSync(emojiJsonPath);
        }
        catch(err) {
            if (err.code !== "ENOENT") {
                throw err;
            }
        }
    });

    it("download `full-emoji-list.html` and `emoji.json` then create `emojiData.json`", function() {
        return emspect.update()
            .then(() => {
                var written = mockFs.readFileSync(
                    emojiJsonPath,
                    'utf-8'
                );

                written = JSON.parse(written);
                assert.deepEqual(written, expectJoined);
            });
    });

    it("throws error when no data in `full-emoji-list.html`", function() {
        requestMock.setFullEmojiListFilename('full-emoji-list-no-data.html');
        return emspect.update()
            .then(assert.fail)
            .catch((err) => {
                assert.equal(err.message, "Failed to parse. No data is found in full-emoji-list.html. The format might have been changed.");
            })
            .then(checkNoOutput);
    });

    it("throws error when found a field which is required but actually missing in an emoji data in `full-emoji-list.html`", function() {
        requestMock.setFullEmojiListFilename('full-emoji-list-with-missing-field.html');
        return emspect.update()
            .then(assert.fail)
            .catch((err) => {
                assert.startsWith(err.message, "Failed to parse. The format of full-emoji-list.html might have been changed. Failed object:");
            })
            .then(checkNoOutput);
    });

    it("throws error when no data in `emoji.json`", function() {
        requestMock.setFullEmojiListFilename('full-emoji-list.html');
        requestMock.setEmojiJsonFilename('emoji-empty.json');
        return emspect.update()
            .then(assert.fail)
            .catch((err) => {
                assert.equal(err.message, "Failed to parse. No data is found in emoji.json. The format might have been changed.");
            })
            .then(checkNoOutput);
    });
});
