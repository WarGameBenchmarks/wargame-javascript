var Values = {
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
  Six: 6,
  Seven: 7,
  Eight: 8,
  Nine: 9,
  Ten: 10,
  Jack: 11,
  Queen: 12,
  King: 13,
  Ace: 14
};

var Suits = {
  Clubs: 1,
  Hearts: 2,
  Diamonds: 3,
  Spades: 4
};

// freeze these objects to make them immutable, so they are effectively enums
Object.freeze(Values);
Object.freeze(Suits);

// Card class
class Card {

  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
  }

  get Value() {
    return this.value;
  }

  get Suit() {
    return this.suit;
  }

  /*
    0 if equal
    positive+ if v1 is higher
    negative- if v2 is higher
  */
  compare(other) {
    let v1 = this.value;
    let v2 = other.value;
    return v1 - v2;
  }

}


// via http://bost.ocks.org/mike/shuffle/
function array_shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

class Deck {

  constructor(cards = []) {
    this.cards = cards;
  }

  split() {
    let cards = this.cards;
    let size = cards.length;
    let half = Math.floor(size / 2); // something to mirror integer division

    var _cards = []; // pop cards off this deck and push them into the new deck
    for (var i = 0; i < half; i++) {let c = cards.pop(); _cards.push(c);}

    return new Deck(_cards);
  }

  // TODO
  shuffle() {
    this.cards = array_shuffle(this.cards);
  }

  get length() {
    return this.cards.length;
  }

  get hasCards() {
    return this.length > 0;
  }

  get card() {
    return this.cards[0];
  }

  addCard(card) {
    this.cards.push(card);
  }

  giveCard(other) {
    if (this.length == 0) {
      return;
    }

    let card = this.cards.shift();
    other.addCard(card);
  }

  giveCards(other) {
    for (var i = 0; i < this.length; i++) {
      this.giveCard(other);
    }
  }

  // accessible anytime via Deck.fresh()
  static fresh() {

    var cards = [];
    [Suits.Clubs, Suits.Hearts, Suits.Diamonds, Suits.Spades].forEach(function(suit){
      [Values.Two, Values.Three, Values.Four, Values.Five,
       Values.Six, Values.Seven, Values.Eight, Values.Nine,
       Values.Ten, Values.Jack, Values.Queen, Values.King, Values.Ace].forEach(function(value){
         let card = new Card(value, suit);
         cards.push(card);
       });
    });

    return new Deck(cards);
  }

}


function game() {

  let player1 = Deck.fresh();

  player1.shuffle();

  let player2 = player1.split();

  let winner = new Deck();

  base: while (player1.hasCards && player2.hasCards) {

    let card1 = player1.card;
    let card2 = player2.card;

    player1.giveCard(winner);
    player2.giveCard(winner);

    if (card1.compare(card2) == 0) {
      //console.log('war began: %o vs %o; deck sizes = %o|%o', card1.value, card2.value, player1.length, player2.length);

      do {

        if (player1.length < 4 || player2.length < 4) {
          //console.log('a player ran out of cards');
          //console.log('deck sizes = %o/%o', player1.length, player2.length);
          break base;
        }

        for (let i = 0; i < 3; i++) {
          player1.giveCard(winner);
          player2.giveCard(winner);
        }

        card1 = player1.card;
        card2 = player2.card;

        if (card1.compare(card2) < 0) {
          //console.log('player2 won war: %o vs %o; deck sizes = %o/%o', card1.value, card2.value, player1.length, player2.length);
          winner.shuffle();
          winner.giveCards(player2);
        } else if (card1.compare(card2) > 0) {
          //console.log('player1 won war: %o vs %o; deck sizes = %o/%o', card1.value, card2.value, player1.length, player2.length);
          winner.shuffle();
          winner.giveCards(player1);
        }

      } while (card1.compare(card2) == 0);

    } else if (card1.compare(card2) < 0) {
      //console.log('player2 won: %o vs %o; deck sizes = %o/%o', card1.value, card2.value, player1.length, player2.length);
      winner.shuffle();
      winner.giveCards(player2);
    } else if (card1.compare(card2) > 0) {
      //console.log('player1 won: %o vs %o; deck sizes = %o/%o', card1.value, card2.value, player1.length, player2.length);
      winner.shuffle();
      winner.giveCards(player1);
    }

  }

}



function initialization() {

  var games = [];
  var diffs = [];
  var tests = 0;
  // measure

  var display = {
    stats: null,
    timeRemaining: null,
    games: null,
    speed: null,
    score: null
  };

  // get hooks to various elements
  function init() {
    display.stats = document.getElementById('stats');
    display.timeRemaining = document.getElementById('time-remaining');
    display.games = document.getElementById('games');
    display.speed = document.getElementById('speed');
    display.score = document.getElementById('score');
    console.log(display);
    document.getElementById('start').addEventListener('click', function(e){
      start();
      e.preventDefault();
    });
  }

  function test() {

    // increment test counter
    tests++;

    // setup performance timers ; TODO make an abstraction for this so other non-chrome's are supported
    var t1 = performance.now();
    var t2 = performance.now();

    var counter = 0; // iteration counter

    // game loop for one second; this repeats 60 times for 1 minute of game time
    // this prevents the browser from marking this as a broken run-away script
    do {
      counter++;
      game();
      t2 = performance.now();
    } while (t2 - t1 <= 1000);

    // push the values onto the array
    var diff = (t2 - t1);
    games.push(counter);
    diffs.push(diff);
  }

  function updateDisplay(games, speed) {
    display.games.innerHTML = games + " games";
    display.speed.innerHTML = speed.toFixed(4) + " g/ms";
    display.timeRemaining.innerHTML = 60 - tests;
  }

  function updateDone(speed) {
    display.score.style['display'] = 'block';
    display.score.innerHTML = 'Score: <strong>' + Math.round(speed) + '</strong>';
  }

  function update(){
    var sum_games = games.reduce((a,b) => a + b);
    var sum_diffs = diffs.reduce((a,b) => a + b);
    var speed = (sum_games / sum_diffs);

    console.log('test %o: %o games took %o ms, or %o g/ms', tests, sum_games, sum_diffs, speed);

    if (games.length >= 60) {
      console.log('done');
      setTimeout(function(){
        updateDone(speed);
      }, 1000);
    }

    updateDisplay(sum_games, speed);
  }


  function start() {
    display.stats.style['display'] = 'block';
    for (let i = 0; i < 60; i++) {
      var delay = i * 10;

      setTimeout(test, delay);
      setTimeout(update, delay);
    }
  }

  init();


}

window.onload = initialization;
