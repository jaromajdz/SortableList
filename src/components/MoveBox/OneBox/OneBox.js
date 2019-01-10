import React from 'react';

const oneBox =(props)=>{
  return <div ref ={r=>props.elem[props.ids]=r}
              className = {props.cssStyle}
              data-id = {props.ids}
              onMouseDown= {e=>props.mouseDown(e, props.ids)}
              onTouchStart = {e=>props.mouseDown(e, props.ids, true)}
              style ={props.st}
              >
                {props.children}
              </div>

};

export default oneBox;
