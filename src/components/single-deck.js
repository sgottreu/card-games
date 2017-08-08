import React from 'react';
import Card from './card';

import './css/SingleDeck.css';

const SingleDeck = ({deck, _className, addToHand, moving_stack, movingStack, landingStack}) => {
  let displayClass = 'block';
  if((_className === 'WasteDeck' || _className === 'StockDeck') && deck.length === 0){
      deck.push({ face: false });
  }

  if(_className === 'StartingDeck'){
    if(deck.length === 0) {
        displayClass = 'none';
    } 
  }
  return (
    <div className={`SingleDeck ${_className}`} style={{ display: displayClass }}>
      {deck.map((card, index) => {
        return (
          <Card 
            card={card} 
            key={index} 
            index={index} 
            _className={_className}
            parent={{name: _className, column: false}} 
            moving_stack={moving_stack}
            addToHand={addToHand}
            movingStack={movingStack} 
            landingStack={landingStack}
            colPos={index}
            
          />
        );
      })}
    </div>
  );
  
}

export default SingleDeck;
