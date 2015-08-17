JavaScript WarGame
===================

A kinda-sorta benchmarking ~~program~~ page in JavaScript.

It feels slow. Watch out.

Notes
-----

Unlike other versions of the WarGame, the JavaScript version cannot run unchecked at full throttle because most browsers will detain it eventually for stalling the main thread. That's a reasonable concern.

To get around that limitation, the WGJS implementation runs for 1 second 60 times, tracking the duration and games run in each sample.
