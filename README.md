JavaScript WarGame
===================

A kinda-sorta benchmarking ~~program~~ page in JavaScript.

It feels slow. Watch out.

Notes
-----
Most browsers will punish long running scripts by asking the user if they really want to continue running them. To avoid that issue:
1. When the page is initialized, two initial tests will be performed and measured. The first measures the time in milliseconds it takes to run 1000 games. The second is the number of games it takes in one timeframe, or 500ms. The number returned by the latter test is used test afterwards too.
2. With the games per timeframe found, the page will sample 120 tests, 500ms each, for a total of 60 seconds or 1 minute (something standard across all wargames).
3. After all that, the values are summed, and used to determine the speed or *g/ms*

This is not as robust, I feel, as the other WarGame implementations, since JavaScript is so *slow*. It can be fast though. On some tests, we've seen between 12 and 20 *g/ms*.
