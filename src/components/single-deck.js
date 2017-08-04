import React from 'react';
import Card from './card';

import './css/SingleDeck.css';

const SingleDeck = ({deck, _className, addToHand, moving_stack, movingStack, landingStack}) => {
  
  if(_className === 'WasteDeck' && deck.length === 0){
      deck.push({ face: false });
  }
  
  return (
    <div className={`SingleDeck ${_className}`}>
      {deck.map((card, index) => {
        return (
          <Card card={card} key={index} index={index} 
            parent={{name: _className, column: false}} 
            moving_stack={moving_stack}
            addToHand={addToHand}
            movingStack={movingStack} 
            landingStack={landingStack}
            
            
          />
        );
      })}
    </div>
  );
  
}

export default SingleDeck;
