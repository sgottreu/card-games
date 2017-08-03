import React from 'react';
import Card from './card';

const StartingDeck = ({deck}) => {
  return (
    <div className="StartingDeck">
      {deck.map((card, index) => {
        return (
          <Card card={card} key={index} />
        );
      })}
    </div>
  );
  
}

export default StartingDeck;
