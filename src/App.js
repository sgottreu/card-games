import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

import SingleDeck from './components/single-deck';
import Tableau from './components/tableau';

import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import * as suitAxe from './img/axe.png';
import * as suitSword from './img/sword.png';
import * as suitFlail from './img/flail.png';
import * as suitCrossbow from './img/crossbow.png';

import './App.css';

injectTapEventPlugin();

const clone = (data) => {
		return (data === undefined) ? {} : JSON.parse(JSON.stringify(data));
}

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

const buildDeck = (suits, ranks, num_decks=1) => {
  var deck = [];
  for(var d=0;d<num_decks;d++){
    for( var s=0,Slen=suits.length;s<Slen;s++){
      for( var r=0,Rlen=ranks.length;r<Rlen;r++){
        deck.push( { suit: suits[s], rank: ranks[r], face: false, parent: { name: false, column: false } } );
      }
    }
  }

  return deck;
};

const classic_solitaire = (state) => {
  let deck = state.deck, tableau = state.tableau, num_stacks = 7;

  if(tableau.length === 0){
    for(var x=0;x<7;x++){
      tableau.push( [] );
    }
  }

  let buildRow = (deck, tableau, num_stacks) => {
    for(var s=1;s<=num_stacks;s++){
      let len = tableau[ s-1 ].length;
      if(len < s) {
        let card = deck.pop();
        card.parent = { name: 'TableauStack', column: s };

        if(len+1 === s) {
          card.face = true;
        }
        tableau[ s-1 ].push( card );
      }
    };
    return { deck: deck, tableau: tableau };
  };

  for(var s=1;s<=num_stacks;s++){
    let _data = buildRow(deck, tableau, num_stacks);

    deck      = _data.deck;
    tableau   = _data.tableau;
  };

  state.deck      = deck;
  state.tableau   = tableau;

  return state;
};

const getCurrentDeck = (state, parent) => {
  let deck = false;
  if(parent.name === 'Hand'){
    deck = state.hand;
  }
  if(parent.name === 'TableauStack'){
    deck = state.tableau[ parent.column ];
  }
  return deck;
};

const setUpdatedDecks = (state, deck, parent) => {
  if(parent.name === 'Hand'){
    state.hand = deck;
  }
  if(parent.name === 'TableauStack'){
    state.tableau[ parent.column ] = deck;
  }
  if(parent.name === 'WasteDeck'){
    state.waste = deck;
  }
  if(parent.name === 'FoundationStack'){
    state.foundations[ parent.column ] = deck;
  }
  return state;
}

const validateDrop = (_state, parent, column) => {
  if(parent.name === 'WasteDeck' && _state.moving_stack[0].parent.name == 'Hand'){
    if(_state.waste.length === 1 && _state.waste[0].rank === undefined){
      _state.waste = [];
    }

    let len = _state.hand.length;
    for(var x=0;x<len;x++){
      let card = _state.hand.shift();
      card.face = false;
      card.parent = {name: 'WasteDeck', column: false};
      _state.waste.push(card);
    }
    _state.moving_stack[0].face = false;
    _state.waste.push(_state.moving_stack[0]);
    _state.moving_stack = [];
    _state.hand = [];
  }

  if(parent.name === 'TableauStack'){

    let len = _state.moving_stack.length;
    for(var x=0;x<len;x++){
      let card = _state.moving_stack.pop();
      card.face = true;
      card.parent = {name: 'TableauStack', column: column};
      _state.tableau[ column ].push(card);
    }
    _state.moving_stack = [];
  }

  return _state;
}

class App extends Component {

  constructor(props){
    super(props);

    this.fillTableau        = this.fillTableau.bind(this);
    this.addToHand          = this.addToHand.bind(this);
    this.addToMovingStack   = this.addToMovingStack.bind(this);
    this.addToLandingStack  = this.addToLandingStack.bind(this);

    let state = {
      game: 'classic_solitaire',
      num_decks: 1,
      tableau: [],
      foundations: [],
      stock: [],
      waste: [],
      hand: [],
      deck: [],
      moving_stack: [],
      landing_stack: { area: false, column: false }
    };

    let deck = buildDeck(suits, ranks, state.num_decks);
    state.deck = multiShuffle( deck );

    this.state = state;
  }

  fillTableau = () => {
    let _state    = this.state;
    let _deck     = _state.deck;
    let _tableau  = _state.tableau;

    if(_state.game === 'classic_solitaire'){
      _state = classic_solitaire(_state);
    }

    _state.stock = clone(_state.deck);
    _state.deck = [];

    this.setState( _state );
  }

  addToHand = () => {
    let _state    = this.state;

    for(var x=1;x<=3;x++){
      let card = _state.stock.pop();
      card.parent = { name: 'Hand', column: false };
      card.face = true;
      _state.hand.push( card );
    }
    this.setState( _state );
  }

  addToMovingStack = (card, parent) => {
    let _state    = this.state;
    if(_state.moving_stack.length > 0){
      return false;
    }

    let deck = false, moving = [];

    deck = getCurrentDeck(_state, parent);

    let len = deck.length-1;

    for(var x=len;x>=0;x--){
      if(deck[x].face && parent.name === 'TableauStack'){
        let card = deck.slice(x,x+1);
        deck.splice(x, 1);
        _state.moving_stack.push( card[0] );
      } else {
        if(deck[x].face && x === len){
          let card = deck.slice(x,x+1);
          deck.splice(x, 1);
          _state.moving_stack.push( card[0] );
        }
      }
    }

    _state = setUpdatedDecks(_state, deck, parent);
console.log(_state);
    this.setState( _state );
  }

  addToLandingStack = (parent, column) => {
    let _state    = this.state;
    if(_state.moving_stack.length === 0){
      return false;
    }

    _state = validateDrop(_state, parent, column);

    this.setState( _state );
  }

  render() {
    return (
      <div className="App">
        {/*<DragDropContextProvider backend={HTML5Backend}>*/}
          <div className="TopDecks">
            <SingleDeck _className="StockDeck" deck={this.state.stock} moving_stack={this.state.moving_stack} addToHand={this.addToHand} />
            <SingleDeck _className="Hand"      deck={this.state.hand}  moving_stack={this.state.moving_stack} movingStack={this.addToMovingStack} landingStack={this.addToLandingStack} />
            <SingleDeck _className="WasteDeck" deck={this.state.waste} moving_stack={this.state.moving_stack} movingStack={this.addToMovingStack} landingStack={this.addToLandingStack}/>
          </div>
          <Tableau tableau_deck={this.state.tableau} moving_stack={this.state.moving_stack} movingStack={this.addToMovingStack} landingStack={this.addToLandingStack}/>
          <SingleDeck _className="MovingDeck" deck={this.state.moving_stack} moving_stack={this.state.moving_stack} movingStack={this.addToMovingStack} landingStack={this.addToLandingStack} />
          <button onTouchTap={this.fillTableau}>Deal Tableau</button>
          <SingleDeck _className="StartingDeck" deck={this.state.deck} />
        {/*</DragDropContextProvider>*/}
      </div>
    );
  }
}

export default App;

