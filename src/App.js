import React, { Component } from 'react';
import StartingDeck from './components/starting-deck';

import * as suitAxe from './img/axe.png';
import * as suitSword from './img/sword.png';
import * as suitFlail from './img/flail.png';
import * as suitCrossbow from './img/crossbow.png';

import './App.css';

function shuffle(array, i) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function multiShuffle(deck, num=10){
  for(var x=0;x<num;x++){
    deck = shuffle( deck );
  }
  return deck;
}

let suits = [
  { name: 'axe', image: suitAxe, color: 'red', cssColor: '#B57204' },
  { name: 'sword', image: suitSword, color: 'red', cssColor: '#B57204' },
  { name: 'flail', image: suitFlail, color: 'black', cssColor: '#000' },
  { name: 'crossbow', image: suitCrossbow, color: 'black', cssColor: '#000' },
]

let ranks = ['A', 2, 3,4,5,6,7,8,9,10,'J','Q','K'];

function buildDeck(suits, ranks, num_decks=1) {
  var deck = [];
  for(var d=0;d<num_decks;d++){
    for( var s=0,Slen=suits.length;s<Slen;s++){
      for( var r=0,Rlen=ranks.length;r<Rlen;r++){
        deck.push( { suit: suits[s], rank: ranks[r], face: false } );
      }
    }
  }

  return deck;
}

class App extends Component {

  constructor(props){
    super(props);

    let deck = buildDeck(suits, ranks);

    this.state = {
      tableau: [],
      foundations: [],
      stock: [],
      waste: [],
      hand: [],
      deck: multiShuffle( deck )
    };
  }

  render() {
    return (
      <div className="App">
        <StartingDeck deck={this.state.deck} />
      </div>
    );
  }
}

export default App;
