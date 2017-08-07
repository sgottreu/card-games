import React from 'react';
import SuitIcon from './suit-icon';
import CardRank from './card-rank';

import './css/Card.css';

const CardFront = ({card}) => {
  return (
    <div className='CardFront' style={{color: card.suit.cssColor }} >
        <div className="CardFrontLabel">
            <SuitIcon image={card.suit.image} />
            <CardRank rank={card.rank} />
        </div>
        <SuitIcon image={card.suit.image} />
        <CardRank rank={card.rank} />
    </div>
  );
  
}

export default CardFront;
