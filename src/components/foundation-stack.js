import React from 'react';

import Card from './card';

import './css/FoundationStack.css';

const FoundationStack = ({stack, index, column, left, moving_stack, movingStack, landingStack}) => {
    if(!stack.deck || stack.deck.length === 0){
      stack.deck = [];
      stack.deck.push({ face: false });
    }

    return (
      <div key={index} className="FoundationStack" data-stack={index+1} style={{left: left}}>
        {
          stack.deck.map((card, i) => {
            card.suit = stack.suit;
            return (
                <Card card={card} key={i} 
                  index={index} 
                  colPos={i} 
                  column={column}
                  parent={{ name: 'FoundationStack', column: index, suit: stack.suit.name }}
                  moving_stack={moving_stack}
                  movingStack={movingStack} 
                  landingStack={landingStack}
                />
            )
          })
        }
      </div>
    );  
}

export default FoundationStack;
