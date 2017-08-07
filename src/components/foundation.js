import React from 'react';
import FoundationStack from './foundation-stack';

import './css/Foundation.css';

const Foundation = ({deck, moving_stack, movingStack, landingStack}) => {
  let index = -1;
  return (
    <div className="Foundation">
      { deck.map((stack, index) => {
        let left = (index+1)*200;
        
        return( 
          <FoundationStack key={index} stack={stack} left={left} column={stack.length-1} index={index} moving_stack={moving_stack} movingStack={movingStack} landingStack={landingStack}/>

          

          
        )
      })}
    </div>
  );
  
}

export default Foundation;
