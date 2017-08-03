import React from 'react';
import CardBackLogo from '../img/card-back-logo.png';


import './css/Card.css';

const CardBack = ({card}) => {
  return (
    <div className='CardBack' style={{color: card.suit.cssColor }} >
        <img src={CardBackLogo} />
    </div>
  );
  
}

export default CardBack;
