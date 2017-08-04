import React from 'react';
import Card from './card';

import './css/StartingDeck.css';

const StartingDeck = ({deck}) => {
  return (
    <div className="StartingDeck">
      {deck.map((card, index) => {
        return (
          <Card card={card} key={index} index={index}/>
        );
      })}
    </div>
  );
  
}

export default StartingDeck;
