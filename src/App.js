import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

import SingleDeck from './components/single-deck';
import Tableau from './components/tableau';
import Foundation from './components/foundation';

// import { DragDropContextProvider } from 'react-dnd';
// import HTML5Backend from 'react-dnd-html5-backend';

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
        card.parent = { name: 'TableauStack', column: s-1 };

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
  if(parent.name === 'WasteDeck'){
    deck = state.waste;
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
    state.foundations[ parent.column ].deck = deck;
  }
  return state;
}

const validateDrop = (_state, parent, column) => {
  let len = 0, card = false, x=0;

  // WasteDeck
  if(parent.name === 'WasteDeck' && _state.moving_stack[0].parent.name === 'Hand'){
    if(_state.waste.length === 1 && _state.waste[0].rank === undefined){
      _state.waste = [];
    }

    len = _state.hand.length;
    for(x=0;x<len;x++){
      card = _state.hand.shift();
      if(card === undefined){
        return false;
      }
      card.face = false;
      card.parent = {name: 'WasteDeck', column: false};
      _state.waste.push(card);
    }
    // _state.moving_stack[0].face = false;
    // _state.waste.push(_state.moving_stack[0]);
    _state.moving_stack = [];
    _state.hand = [];
  }

  // TableauStack
  if(parent.name === 'TableauStack'){
    if( _state.tableau[ column ].length === 0){
      if( _state.moving_stack[0].rank !== 'K' ){
        return _state;
      }
    }
    len = _state.moving_stack.length;
    
    if(!checkTableauRank( _state.tableau[ column ], _state.moving_stack[0] )){
      return _state;
    }

    for(x=0;x<len;x++){
      card = _state.moving_stack.shift();
      if(card === undefined){
        return _state;
      }
      card.face = true;
      card.parent = {name: 'TableauStack', column: column};
      _state.tableau[ column ].push(card);
    }
    _state.moving_stack = [];

    _state = flipTableauCard(_state);
  }

  // MovingDeck
  if(parent.name === 'MovingDeck'){

    len = clone(_state.moving_stack.length);
    for(x=0;x<len;x++){
      card = _state.moving_stack.shift();
      if(card === undefined){
        return _state;
      }
      if(card.parent.name === 'TableauStack'){
        _state.tableau[ card.parent.column ].push(card);
      } else {  
        _state.hand.push(card);
      }
      
    }
    _state.moving_stack = [];
  }

  // FoundationStack
  if(parent.name === 'FoundationStack'){

    len = clone(_state.moving_stack.length);
    for(x=0;x<len;x++){
      let _i = -1;
      _i = _state.foundations.findIndex(f => { return f.suit.name === _state.moving_stack[ x ].suit.name});

      if(parent.suit !== _state.moving_stack[x].suit.name || !checkFoundationRank( _state.foundations[ _i ], _state.moving_stack[ x ] )) {
        return _state;
      }
      card = _state.moving_stack.shift();
      if(card === undefined){
        return _state;
      }
      if(_state.foundations[ _i ].deck[0].rank === undefined){
        _state.foundations[ _i ].deck = [];
      }
      _state.foundations[ _i ].deck.push(card); 
    }
    _state.moving_stack = [];
    _state = flipTableauCard(_state);
  }

  return _state;
}

const flipTableauCard = (_state) => {
  for(var x=0;x<_state.tableau.length;x++){
    let _l = _state.tableau[x].length-1;
    if(_l > -1){
      _state.tableau[ x ][ _l ].face = true;
    } else {

    }
  }
  return _state;
}

const checkFoundationRank = (foundation, card) => {

  if(foundation.deck[0].rank === undefined){
    if(card.rank === 'A'){
      return true;
    }
  } else {
    let len = foundation.deck.length -1
    let rank = foundation.deck[ len ].rank;
    switch(rank){
      case 'A':
        if(card.rank === 2){
          return true;
        }
        break;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        if(rank+1 === card.rank){
          return true;
        }
        break;
      case 10:
        if(card.rank === 'J'){
          return true;
        }
        break;
      case 'J':
        if(card.rank === 'Q'){
          return true;
        }
        break;
      case 'Q':
        if(card.rank === 'K'){
          return true;
        }
        break;
    }
  }

  return false;
}

const checkTableauRank = (tableauStack, card) => {
  let len = tableauStack.length - 1;
  if(len === -1 && card.rank === 'K'){
    return true;
  }

  let rank = tableauStack[ len ].rank;

  if(tableauStack[ len ].suit.color === card.suit.color){
    return false;
  }

  switch(rank){
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
      if(rank-1 === card.rank){
        return true;
      }
      break;
    case 'J':
      if(card.rank === 10){
        return true;
      }
      break;
    case 'Q':
      if(card.rank === 'J'){
        return true;
      }
      break;
    case 'K':
      if(card.rank === 'Q'){
        return true;
      }
      break;
  }
  

  return false;
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

    suits.map( (suit, i) => {
      state.foundations[i] = { suit: suit, deck: false };
      return true;
    });

    this.state = state;
  }

  fillTableau = () => {
    let _state    = this.state;

    if(_state.game === 'classic_solitaire'){
      _state = classic_solitaire(_state);
    }

    _state.stock = clone(_state.deck);
    _state.deck = [];

    this.setState( _state.stock );
  }

  addToHand = () => {
    let _state    = this.state;

    if(_state.stock.length === 1 && _state.stock[0].rank === undefined){
      console.log('waste');
      if(_state.waste[0].rank === undefined){
        delete _state.waste[0];
      }
      for(var x=0;x<_state.waste.length;x++){
        console.log(_state.waste[x].suit.name, _state.waste[x].rank);
      }
      _state.waste.reverse();
      _state.stock = _state.waste;
      _state.waste = [];
    } else {
      for(var x=1;x<=3;x++){
        let card = _state.stock.pop();
        if(card === undefined){
          continue;
        }
        card.parent = { name: 'Hand', column: false };
        card.face = true;
        _state.hand.push( card );
      }
    }

    this.setState( _state );
  }

  addToMovingStack = (card, parent) => {
    let _state    = this.state;
    if(_state.moving_stack.length > 0){
      return false;
    }

    let deck = false;

    deck = getCurrentDeck(_state, parent);
    
    let len = (parent.name === 'WasteDeck') ? clone(_state.hand.length) : clone(deck.length);
    var x = 0;

    while(x<len){
      if(parent.name === 'WasteDeck'){
        if(deck.length === 1 && deck[0].rank === undefined){
          deck = [];
          continue;
        }
        let card = _state.hand.shift();
        if(card === undefined){
          return false;
        }
        card.face = false;
        deck.push(card);
        len = clone(_state.hand.length);
        continue;
      }
      if(deck[x].face && parent.name === 'TableauStack'){
        let card = deck.slice(x,x+1);
        if(card === undefined){
          return false;
        }
        deck.splice(x, 1);
        card = (Array.isArray( card )) ? card[0] : card;
        _state.moving_stack.push( card );
        len = clone(deck.length);
      } else {
        if( deck[x].face && x === (len-1) ){
          let card = deck.slice(x,x+1);
          if(card === undefined){
            return false;
          }
          deck.splice(x, 1);
          card = (Array.isArray( card )) ? card[0] : card;
          _state.moving_stack.push( card );
          len = clone(deck.length);
        } else {
          x++;
        }
      }
    }

    _state = setUpdatedDecks(_state, deck, parent);

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

            <Foundation deck={this.state.foundations} moving_stack={this.state.moving_stack} movingStack={this.addToMovingStack} landingStack={this.addToLandingStack}/>
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

