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
    let v1 = this.getValue();
    let v2 = other.getValue();
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

  constructor(cards) {
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
    return this.length() > 0;
  }

  get card() {
    return this.cards[0];
  }

  addCard(card) {
    this.cards.push(card);
  }

  giveCard(other) {
    if (this.length() == 0) {
      return;
    }

    let card = this.cards.pop(0);
    other.addCard(card);
  }

  giveCards(other) {
    for (var i = 0; i < this.length(); i++) {
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



  



}
