import React from 'react';
import TableauStack from './tableau-stack';

import './css/Tableau.css';

const Tableau = ({tableau_deck, moving_stack, movingStack, landingStack}) => {
  return (
    <div className="Tableau">
      {tableau_deck.map((stack, index) => {
        let left = (index+1)*200;
        
        return(
          <TableauStack key={index} stack={stack} left={left} column={stack.length-1} index={index} moving_stack={moving_stack} movingStack={movingStack} landingStack={landingStack}/>
        )
      })}
    </div>
  );
  
}

export default Tableau;
