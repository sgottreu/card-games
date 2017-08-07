import React from 'react';
import CardFront from './card-front';
import CardBack from './card-back';

import './css/Card.css';

const Card = ({card, index, colPos, columnLen, parent, movingStack, landingStack, moving_stack, addToHand}) => {

  const getCardFace = (card, parent) => {
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

  const chosenAction = (card, parent, moving_stack, column) => {
    if(parent.name === 'StockDeck'){
      addToHand();
      return true;
    }
    if(moving_stack.length === 0){
      movingStack(card, parent);
    } else {
      landingStack(parent, column);
    }
  }

  let top = (colPos === 0) ? '0px' : (parent.name === 'TableauStack') ? '-'+(colPos*116).toString()+'px' : '0px';

  if(parent.name === 'MovingDeck'){
    top = +(colPos*46).toString()+'px';
  }
  

  let phanthom = (card.rank === undefined) ? 'phanthom' : '';

  if(parent.name === 'FoundationStack' && card.rank === undefined) {
    card.face = true;
  }

  return (
    <div className={`Card ${phanthom}`} style={{zIndex: index+1, top: top }} onTouchTap={() => { chosenAction(card, parent, moving_stack, index) } }>
        {getCardFace(card, parent)}
    </div>
  );
  
}

export default Card;
