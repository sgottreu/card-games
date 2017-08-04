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

  const chosenAction = (card, parent, moving_stack, colPos) => {
    if(parent.name === 'StockDeck'){
      addToHand();
      return true;
    }
    if(moving_stack.length === 0){
      movingStack(card, parent);
    } else {
      landingStack(parent, colPos);
    }
  }

  let top = (colPos === 0) ? '0px' : (parent.name === 'TableauStack') ? '-'+(colPos*136).toString()+'px' : '0px';

  let phanthom = (card.rank === undefined) ? 'phanthom' : '';

  if(parent.name === 'TableauStack' && columnLen === colPos) {

  }

  return (
    <div className={`Card ${phanthom}`} style={{zIndex: index+1, top: top }} onTouchTap={() => { chosenAction(card, parent, moving_stack, colPos) } }>
        {getCardFace(card, parent)}
    </div>
  );
  
}

export default Card;
