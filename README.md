JavaScript WarGame
===================

A kinda-sorta benchmarking ~~program~~ page in JavaScript.

It feels slow. Watch out.

Notes
-----

Unlike other versions of the WarGame, the JavaScript version cannot run unchecked at full throttle because most browsers will detain it eventually for stalling the main thread. That's a reasonable concern.

To get around that limitation, the WGJS implementation runs for 1 second 60 times, tracking the duration and games run in each sample.

While I get the awful performance sorted out, here are my findings (2015-8-17).
- Mobile Chrome on my Nexus 6 is very often scoring 0 or 1
- Mobile Firefox on my Nexus 6 is decent, scoring 4
- Desktop Chrome can sometimes peak at 11, but then quickly fall to an average 6, or fall even further to a 3
- Desktop Firefox scores a stable 10
- Desktop Edge scores a 4
