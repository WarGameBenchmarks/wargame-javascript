
function initialization() {

  var games = [];
  var diffs = [];
  var samples = 0, limit = 0;
  var N_SAMPLES = 120;
  // measure

  var payload = {
    wargame: '',
    template: ''
  }

  var display = {
    stats: null,
    countdown: null,
    games: null,
    speed: null,
    score: null
  };

  var frame = {
    jq: null,
    iframe: null
  };

  function getMSIn1KGames() {
    let t1 = Profiler.time(), t2 = 0, d = 0, n = 1000;
    for (let _i = 0; _i < 1000; _i++) {game();}
    t2 = Profiler.time();
    d = t2 - t1;
    console.log('%d wargames: %s ms total; %s g/ms', n, d.toFixed(4), (n/d).toFixed(4));
    return t2;
  }

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

  function collect(iterations, time) {
    games.push(iterations);
    diffs.push(time);

    console.log('collected data');

    update();
  }

  window.collector = collect;

  // get hooks to various elements
  function init() {
    display.frame = $('#frame');
    display.stats = $('#stats');
    display.countdown = $('#countdown');
    display.games = $('#games');
    display.speed = $('#speed');
    display.score = $('#score');
    display.start = $('#start');

    setup_limits();
    setup_payload();
    setup_start();
    setup_frame();
  }

  function setup_frame() {
    frame.jq = $('<iframe id="testframe" class="hidden" />');
    frame.iframe = frame.jq.get(0);
    display.frame.append(frame.iframe);
  }

  function setup_start() {
    display.start.show();
    display.start.on('click', function(e){
      start();
      e.preventDefault();
    });
  }

  function setup_payload() {
    $.ajax({
      dataType: 'text',
      url: 'resources/build/js/wargame.js',
    }).done(function(t1){
      payload.wargame = t1;
    }).then(function(){
      $.ajax({
        dataType: 'text', url: 'resources/templates/test-template.html'
      }).done(function(t2){
        payload.template = t2;
      }).then(function(){
        display.start.css('display', 'block');
      });
    });
  }

  // Test: does the WarGame build actually work? Have it fail here instead, first.
  function setup_limits() {
      // limit = Math.floor(getGamesInSecond());
      limit = (getGamesInTimeframe());
      getMSIn1KGames(); // ignore this fow now
  }

  function test() {
    var counter = 0; // iteration counter

    // setup performance timers ; TODO make an abstraction for this so other non-chrome's are supported
    var t1 = Profiler.time();
    var t2 = t1;

    // game loop for one second; this repeats 60 times for 1 minute of game time
    // this prevents the browser from marking this as a broken run-away script, hopefully

    // while ((t2 - t1) <= 1000) {
    //   counter++;
    //   game();
    //   t2 = Profiler.time();
    // }
    var i = limit;
    for (; i > 0; i--) {game();}
    t2 = Profiler.time();
    counter += limit;

    // push the values onto the array
    var time_difference = (t2 - t1);
    // record(counter, time_difference);
    collect(counter, time_difference);
  }


  function sample() {

    // increment test counter
    samples++

    console.log('sample %o: test began', samples);

    test();

    console.log('sample %o: test completed', samples);

    // update();

    if (games.length < N_SAMPLES) {
      setTimeout(sample, 50);
    }


  }

  function updateDisplay(games, speed) {
    display.games.html(games + " games");
    display.speed.html(speed.toFixed(4) + " g/ms");
    display.countdown.html( N_SAMPLES - samples == -1 ? 0 : N_SAMPLES - samples );
  }

  function updateDone(speed) {
    display.score.css('display', 'block');
    display.score.html('Score: <strong>' + Math.round(speed) + '</strong>');
  }

  function update(){
    if (games.length == 0 || diffs.length == 0) {
      updateDisplay(0, 0);
      return;
    }
    var sum_games = games.reduce((a,b) => a + b);
    var sum_diffs = diffs.reduce((a,b) => a + b);
    var speed = (sum_games / sum_diffs);

    console.log('sample %o: %o games took %s ms, or %s g/ms', games.length, sum_games, sum_diffs.toFixed(4), speed.toFixed(4));

    if (games.length >= N_SAMPLES) {
      console.log('done');
      setTimeout(function(){
        updateDone(speed);
      }, 500);
    }

    updateDisplay(sum_games, speed);
  }


  function start() {
    display.stats.css('display', 'block');

    display.start.html('Loading...');

    setTimeout(function(){
      display.start.hide();
      setTimeout(sample, 500);
    }, 100);
  }

  init();



}

window.onload = initialization;
