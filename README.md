📧Ⓜ️💲🅿️📧©️📍  - EMSPECT
========================

![Node Version](https://img.shields.io/node/v/emspect.svg?style=flat-square)
[![NPM Version](https://img.shields.io/npm/v/emspect.svg?style=flat-square)](https://www.npmjs.org/package/emspect)
[![Build Status](https://img.shields.io/travis/mecab/emspect.svg?style=flat-square)](https://travis-ci.org/mecab/emspect)
[![Coverage Status](https://img.shields.io/coveralls/mecab/emspect.svg?style=flat-square)](https://coveralls.io/github/mecab/emspect)
[![Dependencies](https://img.shields.io/david/mecab/emspect.svg?style=flat-square)](https://david-dm.org/mecab/emspect)

Emspect is a CLI utility to search emojis and inspect details of the character.
It works on Node.js and can be also used as Node.js library so you can embed its
features to your cool applications. "Emspect" stands for EMoji inSPECTor.

Examples
--------
```bash
$ emspect sleep
😪 SLEEPY FACE (U+1F62A) - face, person, sleep :sleepy:
😴 SLEEPING FACE (U+1F634) - face, person, sleep, zzz :sleeping:
💤 SLEEPING SYMBOL (U+1F4A4) - comic, emotion, person, sleep, symbol, word, zzz :zzz:
🛌 SLEEPING ACCOMMODATION (U+1F6CC) - hotel, object, sleep
🛏 BED (U+1F6CF) - bed, hotel, object, sleep
```

```bash
$ emspect sleep --format all # verbose
U+1F62A 😪       SLEEPY FACE     2010ʲ   emoji   face, person, sleep     :sleepy:
U+1F634 😴       SLEEPING FACE   2012ˣ   emoji   face, person, sleep, zzz        :sleeping:
U+1F4A4 💤       SLEEPING SYMBOL 2010ʲ   emoji   comic, emotion, person, sleep, symbol, word, zzz        :zzz:
U+1F6CC 🛌       SLEEPING ACCOMMODATION  2014ˣ   emoji   hotel, object, sleep
U+1F6CF 🛏       BED     2014ʷ   text    bed, hotel, object, sleep
```

```bash
$ emspect U+1F62A --format json # Can search from character code. Also output in JSON
[{"code":"U+1F62A","chars":"😪","name":"SLEEPY FACE","synonym":null,"age":"2010ʲ","default":"emoji","annotations":["face","person","sleep"],"aliases":["sleepy"]}]
```

```bash
$ emspect "🈁" --format "%C %G" # tell me GFM emoji code!
🈁 :koko:
```

```bash
$ emspect -n WHITE -a symbol # name contains `WHITE` and has annotation `symbol`
💮 WHITE FLOWER (U+1F4AE) - flower, object, symbol :white_flower:
✅ WHITE HEAVY CHECK MARK (U+2705) - check, mark, sign, symbol :white_check_mark:
❔ WHITE QUESTION MARK ORNAMENT (U+2754) - mark, outlined, punctuation, question, symbol, word :grey_question:
❕ WHITE EXCLAMATION MARK ORNAMENT (U+2755) - exclamation, mark, outlined, punctuation, symbol, word :grey_exclamation:
▫️ WHITE SMALL SQUARE (U+25AB) - geometric, sign, square, symbol :white_small_square:
◻️ WHITE MEDIUM SQUARE (U+25FB) - geometric, sign, square, symbol :white_medium_square:
◽️ WHITE MEDIUM SMALL SQUARE (U+25FD) - geometric, sign, square, symbol
⬜️ WHITE LARGE SQUARE (U+2B1C) - geometric, sign, square, symbol
🔳 WHITE SQUARE BUTTON (U+1F533) - button, geometric, outlined, sign, square, symbol :white_square_button:
⚪️ MEDIUM WHITE CIRCLE (U+26AA) - circle, geometric, sign, symbol
```

Requirements
-------------
 - Node.js >= 4

Installation
-------------
```bash
$ npm install -g emspect
```

Usage
------
### Lazy Query™
Basic usage is just one argument to emspect like:

```bash
$ emspect sleep
$ emspect SLEEP
$ emspect 😪
$ emspect U+1F62A
$ emspect :sleepy:
```
In this case emspect estimates context of the search and returns (hopefully)
suitable result. To put it concretely, it goes with following rule.

We have five searchable field for each emoji. Taking an example of 😪,

- `code` -- `U+1F62A`
- `chars` -- `😪`
- `name` -- `SLEEPY FACE`
- `annotations` -- `+1`, `body`, `hand`, `person`, `thumb`, `thumbs up`, `up`
- `gfm` -- `+1`, `thumbsup`

Then the field to match is depends on the query.

- `emspect sleep` -- Small letters matches to `annotations`. It searches by
  exact match, e.g., `sle` doesn't match to `sleep`.

- `emspect SLEEP` -- capital letters matches to `name`. It searches by partial
  match, e.g., `CAR` mathes to `CARD`. Note capitalization tells emspect to
  search by `name`, however actual search is case-insensitive, so
  `emspect FLAG` can return the emojis such as 🇯🇵 (`Flag for Japan`).

- `emspect 😪` -- an emoji matches to the emoji directly.

- `emspect U+1F62A` -- letters starting `U+` matches `code`. It searches by
  partial match, e.g., `U+1F62` matches other faces near 😪, such as 😠 (`U+1F620`)
  or 😡 (`U+1F621`). Also `U+1F3FF` matches emojis which have `TYPE-6`
  (the darkest) skin color like 👍🏿  (`U+1F44D U+1F3FF`).

- `emspect :sleepy:` -- letters surrounded by `:` matches `gfm`. It searchs by
  exact match.

- `emspect :sle` -- letters just starting with `:` also match `gfm` but conducts
  prefix search.

### Search Context Options

'[Please don't say "You are lazy"](https://www.youtube.com/watch?v=lX-yENHkeMo)'? Emspect has following options which enables you to specify them.

- `-a <query>` or `--anotations <query>`
- `-n <query>` or `--name <query>`
- `-c <query>` or `--code <query>`
- `-C <query>` or `--char <query>`
- `-g <query>` or `--gfm <query>` -- same as `emspect :<query>:`.
  Colon can be appended.
  i.e., `-g :+1:` and `-g +1` is same

- `-G <query>` or `--gfm-startswith <query>` -- same as `emspect :<query>`

When multiple options are given, emspect conducts and-search. The options can
be used multiple times. Note you must double-quate when the query contains space.
The complete example follows:

```bash
$ emspect -n "WITH FACE" -a bright -a moon
🌝 FULL MOON WITH FACE (U+1F31D) - bright, face, full, moon, nature, place, space, weather :full_moon_with_face:
```

### All

```bash
$ emspect
```

Returns all emojis. Then you can pipe to `grep` or any commands so that you can
cook them as you want🍳 . `--format all` options, described below, should be
useful.

### Formatting

`-f <format>` or `--format <format>` option customizes the outputs. `<format>`
is string, can contain following descriptors.

- `%c` -- Extracted to `code`, e.g. `U+1F62A`
- `%C` -- Extracted to `chars`, e.g. `😪`
- `%n` -- Extracted to `name`, e.g. `SLEEPY FACE`
- `%a` -- Extracted to `annotations`. Comma (with space) separated, e.g.
  `+1, body, hand, person, thumb, thumbs up, up`
- `%g` -- Extracted to `gfm`. Comma (with space) separated, e.g. `+1, thumbsup`
- `%G` -- Similar to `gfm`, but adds colons, e.g. `:+1:, :thumbsup:`
- `%y` -- Extracted to `year`, e.g. `2010ʲʷ`
- `%d` -- Extracted to `default presentation style`, e.g. `emoji`

For details of `year` and `default presentation style`, see
http://unicode.org/emoji/charts/index.html#emoji-data-chart-key .

There are two special format options.

- `--format all` -- Prints all data in tab-separated. Could be useful with
  pipes. It is same to `--format "%c\t%C\t%n\t%y\t%d\t%a\t%G"`

- `--format json` -- Prints all data in JSON. Could be useful with
  [jq](https://stedolan.github.io/jq/). Also building your cool emoji web API.

### OR Search

Currently we doesn't provide or-search, but you can ealisly achieve it with
sub-shell.

```bash
$ (emspect -a man -a person & emspect -a woman -a person) | sort | uniq
```

This shows the results like that `(man AND person) OR (woman AND person)`.
Note we need `| sort | uniq` to remove dupulicates. Compare to

```bash
$ (emspect -a man -a person & emspect -a woman -a person)
```

then you can find `👫 `, i.e., `man AND woman` is duplicated. One more tip that
`(emspect foo & emspect bar)` is faster than `(emspect foo && emspect bar)` or
`(emspect foo; emspect bar)` because `&` executes commands in parallel.

---

For more details, taking a look of `./test/emojis.js` will help your understand.

More Examples
-------------
See [Wiki](https://github.com/mecab/emspect/wiki/Funny-Examples)!

Acknowledgement
---------------
Emspect employs unicode.org's [Full Emoji Data](http://unicode.org/emoji/charts/full-emoji-list.html) and github/gemoji's [emoji.json](https://github.com/github/gemoji/blob/master/db/emoji.json) to generate our [emojiData.json](https://github.com/mecab/emspect/blob/master/emojiData.json).

License
-------
Copyright (c) 2016 mecab

Emspect is released under the [MIT license](https://github.com/mecab/emspect/blob/master/LICENSE).
