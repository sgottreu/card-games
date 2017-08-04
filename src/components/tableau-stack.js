import React from 'react';

import Card from './card';

import './css/TableauStack.css';

const TableauStack = ({stack, index, column, left, moving_stack, movingStack, landingStack}) => {
    return (
      <div key={index} className="TableauStack" data-stack={index+1} style={{left: left}}>
        {
          stack.map((card, i) => {
            return (
                <Card card={card} key={i} 
                  index={i} 
                  colPos={i} 
                  column={column}
                  parent={{ name: 'TableauStack', column: column}}
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

export default TableauStack;
