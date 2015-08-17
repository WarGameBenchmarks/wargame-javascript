
function initialization() {

  var games = [];
  var diffs = [];
  var samples = 0;
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

  function listener(iterations, time) {
    games.push(iterations);
    diffs.push(time);

    console.log('listener accepted data');

    update();
  }

  window.listen = listener;

  // get hooks to various elements
  function init() {
    display.frame = $('#frame');
    display.stats = $('#stats');
    display.countdown = $('#countdown');
    display.games = $('#games');
    display.speed = $('#speed');
    display.score = $('#score');
    display.start = $('#start');

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


  function sample() {

    // increment test counter
    samples++

    console.log('sample %o', samples);

    var re = /\/\/\s\%\%\%/gi; // should replace // %%%
    var content = payload.template.replace(re, payload.wargame);

    frame.iframe.contentDocument.open();
    frame.iframe.contentDocument.write(content);
    frame.iframe.contentDocument.close();

    console.log('sample %o: iframe written', samples);

    // update();

    if (games.length < 60) {
      setTimeout(sample, 0);
    }


  }

  function updateDisplay(games, speed) {
    display.games.html(games + " games");
    display.speed.html(speed.toFixed(4) + " g/ms");
    display.countdown.html( 60 - samples == -1 ? 0 : 60 - samples );
  }

  function updateDone(speed) {
    display.score.css('display', 'block');
    display.score.html('Score: <strong>' + Math.round(speed) + '</strong>');
  }

  function update(){
    if (games.length == 0 || diffs.length == 0) {
      return;
    }
    var sum_games = games.reduce((a,b) => a + b);
    var sum_diffs = diffs.reduce((a,b) => a + b);
    var speed = (sum_games / sum_diffs);

    console.log('sample %o: %o games took %o ms, or %o g/ms', games.length, sum_games, sum_diffs, speed);

    if (games.length >= 60) {
      console.log('done');
      setTimeout(function(){
        updateDone(speed);
      }, 1000);
    }

    updateDisplay(sum_games, speed);
  }


  function start() {
    display.stats.css('display', 'block');
    display.start.hide();

    setTimeout(sample, 1000);
  }

  init();

  // Test: does the WarGame build actually work? Have it fail here instead, first.
(function(){
  let t1 = performance.now(), t2 = 0, n = 1000;
  for (let _i = 0; _i < 1000; _i++) {game();}
  t2 = performance.now() - t1;
  console.log('%d wargames: %s ms total; %s g/ms', n, t1.toFixed(4), (n/t2).toFixed(4));
})();

}

window.onload = initialization;
