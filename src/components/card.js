import React from 'react';
import CardFront from './card-front';
import CardBack from './card-back';

import './css/Card.css';

const Card = ({card}) => {

  const getCardFace = (card) => {
    if(card.face){
      return (
        <CardFront card={card} />
      );
    } else {
      return (
        <CardBack card={card} />
      )
    }
  };

  return (
    <div className='Card' style={{color: card.suit.cssColor }} >
        {getCardFace(card)}
    </div>
  );
  
}

export default Card;
