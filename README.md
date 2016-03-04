📧Ⓜ️💲🅿️📧©️📍  - EMSPECT
========================
Emspect is a CLI utility to search emojis and inspect details of the character. It works on Node.js and can be also used as Node.js library so you can embed its features to your cool applications.

Examples
--------
```bash
$ node ./bin/emspect sleep
😪 SLEEPY FACE (U+1F62A) - face, person, sleep :sleepy:
😴 SLEEPING FACE (U+1F634) - face, person, sleep, zzz :sleeping:
💤 SLEEPING SYMBOL (U+1F4A4) - comic, emotion, person, sleep, symbol, word, zzz :zzz:
🛌 SLEEPING ACCOMMODATION (U+1F6CC) - hotel, object, sleep
🛏 BED (U+1F6CF) - bed, hotel, object, sleep
```

```bash
$ node ./bin/emspect sleep --format all # verbose
U+1F62A 😪       SLEEPY FACE     2010ʲ   emoji   face, person, sleep     :sleepy:
U+1F634 😴       SLEEPING FACE   2012ˣ   emoji   face, person, sleep, zzz        :sleeping:
U+1F4A4 💤       SLEEPING SYMBOL 2010ʲ   emoji   comic, emotion, person, sleep, symbol, word, zzz        :zzz:
U+1F6CC 🛌       SLEEPING ACCOMMODATION  2014ˣ   emoji   hotel, object, sleep
U+1F6CF 🛏       BED     2014ʷ   text    bed, hotel, object, sleep
```

```bash
$ node ./bin/emspect U+1F62A --format json # Can search from character code. Also output in JSON
[{"code":"U+1F62A","chars":"😪","name":"SLEEPY FACE","synonym":null,"age":"2010ʲ","default":"emoji","annotations":["face","person","sleep"],"aliases":["sleepy"]}]
```

```bash
$ node ./bin/emspect "🈁" --format "%C %G" # tell me GFM emoji code!
🈁 :koko:
```

```bash
$ node ./bin/emspect -n WHITE -a symbol # name contains `WHITE` and has annotation `symbol`
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
```bash
$ emspect --help
$
$ less ./test/emojis.js
```

I'm updating documents in hurry 💦
