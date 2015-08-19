
/*
  Initialize the testing page, and setup the tests.
*/
function initialization() {
  // global variables to store data in
  var games = [];
  var diffs = [];
  var samples = 0, limit = 0;

  // configuration; looking for 120 samples (since each sample is 500 ms now)
  var N_SAMPLES = 120;

  /*
    Global object to contain element references.
  */
  var display = {
    stats: null,
    countdown: null,
    games: null,
    speed: null,
    score: null
  };

  /*
    Gets the number of MS that it takes 1000 games to run in.
  */
  function getMSIn1KGames() {
    let t1 = Profiler.time(), t2 = 0, d = 0, n = 1000;
    for (let _i = 0; _i < 1000; _i++) {game();}
    t2 = Profiler.time();
    d = t2 - t1;
    console.log('%d wargames: %s ms total; %s g/ms', n, d.toFixed(4), (n/d).toFixed(4));
    return t2;
  }

  /*
    Gets the number of games that it takes in the given timeframe, specifically set to 500ms right now.
  */
  function getGamesInTimeframe() {
    let t1 = Profiler.time(), t2 = t1, n = 500, i = 0;
    while ((t2 - t1) <= n) {
      i++;
      game();
      t2 = Profiler.time();
    }
    console.log('%d wargames: %s ms total; %s g/ms', i, n, (i/n).toFixed(4));
    return i;
  }

  /*
    In the original framed version, this would collect the game count and duration of the tests in the frame.
    It functions the same now, but also calls update once the data collection is done.
  */
  function collect(iterations, time) {
    games.push(iterations);
    diffs.push(time);

    console.log('collected data');

    update();
  }

  /*
    Hook up various parts of the page UI.
  */
  function init() {
    display.frame = $('#frame');
    display.stats = $('#stats');
    display.countdown = $('#countdown');
    display.games = $('#games');
    display.speed = $('#speed');
    display.score = $('#score');
    display.start = $('#start');

    setup_limits();
    setup_start();
  }

  /*
    Setup the start button, show it and add the click handler.
  */
  function setup_start() {
    display.start.css('display', 'block');
    display.start.on('click', function(e){
      start();
      e.preventDefault();
    });
  }

  /*
    How many games does it take to equal the timeframe? Find out here
  */
  function setup_limits() {
      limit = (getGamesInTimeframe());
      getMSIn1KGames(); // ignore this fow now
  }

  /*
    The actual testing function:
    1. start the timer using the Profiler polyfill
    2. loop from the limit found previously by the timeframe, to 0
    3. collect the data into the collection data arrays
  */
  function test() {
    var counter = 0; // iteration counter

    // setup performance timers
    var t1 = Profiler.time();
    var t2 = t1;

    // game loop for one timeframe worth of games; this repeats N_SAMPLE times for 1 minute of game time
    // this prevents the browser from marking this as a broken run-away script, hopefully

    var i = limit;
    while (i--) {
      game();
    }
    t2 = Profiler.time();
    counter += limit;

    var time_difference = (t2 - t1);
    // push the values onto the array
    collect(counter, time_difference);
  }

  /*
    Call each test, one after the other, with a bit of delay between each so the browser can draw or paint or something.
  */
  function sample() {
    // increment test counter
    samples++

    console.log('sample %o: test began', samples);

    test();

    console.log('sample %o: test completed', samples);

    if (games.length < N_SAMPLES) {
      setTimeout(sample, 50);
    }
  }

  /*
    Update the UI on the page when the tests are being sampled.
  */
  function updateDisplay(games, speed) {
    display.games.html(games + " games");
    display.speed.html(speed.toFixed(4) + " g/ms");
    display.countdown.html( N_SAMPLES - samples == -1 ? 0 : N_SAMPLES - samples );
  }

  /*
    Update the UI when the sampling is over.

    Display the score.
  */
  function updateDone(speed) {
    display.score.css('display', 'block');
    display.score.html('Score: <strong>' + Math.round(speed) + '</strong>');
  }

  /*
    On each update, calculate the sum of the game iterations, and the total duration,
    and then get an average between them to get a speed value.
  */
  function update(){
    if (games.length == 0 || diffs.length == 0) {
      updateDisplay(0, 0);
      return;
    }
    var sum_games = games.reduce((a,b) => a + b);
    var sum_diffs = diffs.reduce((a,b) => a + b);
    var speed = (sum_games / sum_diffs);

    console.log('sample %o: %o games took %s ms, or %s g/ms', games.length, sum_games, sum_diffs.toFixed(4), speed.toFixed(4));

    // if the number of samples is larger or equal to N_SAMPLES, we're done here
    // so updateDone and show the score
    if (games.length >= N_SAMPLES) {
      console.log('done');
      setTimeout(function(){
        updateDone(speed);
      }, 500);
    }

    updateDisplay(sum_games, speed);
  }

  /*
    When the start button is pressed, start.
  */
  function start() {
    display.stats.css('display', 'block');

    display.start.html('Loading...');

    setTimeout(function(){
      display.start.hide();
      setTimeout(sample, 500);
    }, 100);
  }

  // initialize this mess
  init();
}

window.onload = initialization;
