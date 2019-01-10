import React, { Component } from 'react';
import PropTypes from 'prop-types';

import OneBox from './OneBox/OneBox'

import './MoveBoxes.css'


class MoveBoxes extends Component {

      elems = []

      state = {
        x: null,
        y: null,
        left: 0,
        top: 0,
        id: null,
        touch: false,
        copyX: 0,
        copyY: 0,
        listJSX: null,
        list: null
      }

    componentDidMount(){
        this.setState({listJSX: this.boxesGenerator(this.props.list), list: [...this.props.list]})
          }

    boxesGenerator =(list)=>{
      return list.map((elem, id)=>(
          <OneBox
              mouseDown = {this.onMouseDownHandler}
              ids = {id}
              cssStyle="Move Mv"
              elem = {this.elems}
              key = {id}
            >
            {elem}
          </OneBox>
          )
        )
      }

      onMouseDownHandler = (e, id, touch=false)=>{

        let eclientX, eclientY;

        if (touch) {
          if (e.touches.length !== 1) {return;}
            eclientX = e.touches[0].clientX;
            eclientY = e.touches[0].clientY;
          } else {
            eclientX = e.clientX;
            eclientY = e.clientY;
        }

        this.setState({
                        x: eclientX,
                        y: eclientY,
                        top: +this.elems[id].style.top.replace('px',''),
                        left: +this.elems[id].style.left.replace('px',''),
                        id: id,
                        touch: touch,
                        copyX: this.elems[id].offsetLeft,
                        copyY: this.elems[id].offsetTop,
                      })
        this.elems[id].style.zIndex = 100
        this.elems[id].className = "Move Dragging"
        this.elems[id].style.transition = "none"

        document.body.style.cursor = "move";
        document.addEventListener("selectstart", this.disableSelect);
        document.addEventListener('mousemove', this.onDragHandler)
        document.addEventListener('mouseup', this.onMouseUpHandler)

        document.addEventListener('touchmove', this.onDragHandler)
        document.addEventListener('touchend', this.onMouseUpHandler);
     }

     disableSelect = (e)=>{
       e.preventDefault();
     }

     onDragHandler = (e) =>{
      e.preventDefault();

      let eclientX, eclientY;

      if (this.state.touch) {
         eclientX = e.touches[0].clientX;
         eclientY = e.touches[0].clientY;

       } else {
         eclientX = e.clientX;
         eclientY = e.clientY;
       }

       this.setState((prevState)=>{

         let overElem, shift
         let update = {copyX: prevState.copyX, copyY: prevState.copyY}
         let updateList = [...this.state.list]
         const curTop = eclientY - prevState.y  + prevState.top
         const curLeft = eclientX - prevState.x + prevState.left

         this.elems[this.state.id].style.top = `${curTop}px`
         this.elems[this.state.id].style.left = `${curLeft}px`


         if(eclientY - prevState.y>0){
           //check what is below
           shift = Math.ceil(getComputedStyle(this.elems[this.state.id], null).getPropertyValue('border-bottom-width').replace('px','')) + 3

           overElem = document.elementFromPoint(
                    this.elems[this.state.id].offsetLeft + this.elems[this.state.id].clientWidth/2,
                    this.elems[this.state.id].offsetTop + this.elems[this.state.id].clientHeight + shift
                    )
           }

          //check what is above
        if(eclientY - prevState.y<0){
           shift = (Math.ceil(getComputedStyle(this.elems[this.state.id], null).getPropertyValue('border-top-width').replace('px','')) + 3) * (-1)

           overElem = document.elementFromPoint(
                    this.elems[this.state.id].offsetLeft + this.elems[this.state.id].clientWidth/2,
                    this.elems[this.state.id].offsetTop + shift
                    )
           }

          if(overElem){
              if(overElem.getAttribute('class')==='Move Mv'){

                  if((this.elems[this.state.id].offsetTop + this.elems[this.state.id].clientHeight /2 > overElem.offsetTop + shift)
                        && (this.elems[this.state.id].offsetTop + this.elems[this.state.id].clientHeight /2 < overElem.offsetTop + overElem.clientHeight + shift)
                        && (this.elems[this.state.id].offsetLeft + this.elems[this.state.id].clientWidth/2 > overElem.offsetLeft)
                        && ((this.elems[this.state.id].offsetLeft + this.elems[this.state.id].clientWidth/2 < overElem.offsetLeft + overElem.clientWidth))
                    ){
                      update = {
                          copyX: overElem.offsetLeft,
                          copyY: overElem.offsetTop
                        }



                        let moveId = this.elems[this.state.id].getAttribute('data-id')
                        let overId = overElem.getAttribute('data-id')

                        overElem.setAttribute('data-id', moveId)
                        this.elems[this.state.id].setAttribute('data-id', overId)

                        updateList.splice(+overId, 0, updateList.splice(+moveId, 1)[0])

                        //overElem.style.transitionDuration = "0.2s"
                        //overElem.style.transitionProperty = "left,top"

                        overElem.style.top = `${+overElem.style.top.replace('px', '') + this.state.copyY - overElem.offsetTop}px`
                        overElem.style.left = `${ +overElem.style.left.replace('px', '') + this.state.copyX - overElem.offsetLeft}px`
                      }
                }
            }

         return {
             x: eclientX,
             y: eclientY,
             left: curLeft,
             top: curTop,
             copyX: update.copyX,
             copyY: update.copyY,
             list: [...updateList]
           }
         }
       )

        //check if is outside the box
        if(!this.props.moveOutside){
           if( (this.elems[this.state.id].offsetLeft + this.elems[this.state.id].clientWidth/2
                >this.elems[this.state.id].parentNode.offsetLeft + this.elems[this.state.id].parentNode.clientWidth)
                ||
                (this.elems[this.state.id].offsetLeft + this.elems[this.state.id].clientWidth/2
                     <this.elems[this.state.id].parentNode.offsetLeft)
                ||
                (this.elems[this.state.id].offsetTop
                     >this.elems[this.state.id].parentNode.offsetTop + this.elems[this.state.id].parentNode.clientHeight)
                ||
                (this.elems[this.state.id].offsetTop + this.elems[this.state.id].clientHeight
                     <this.elems[this.state.id].parentNode.offsetTop)
           ){
             this.endDragging();
             }
          }
     }

     onMouseUpHandler = (e) =>{
         this.endDragging();
     }

     endDragging(){

       this.elems[this.state.id].style.top = `${ +this.elems[this.state.id].style.top.replace('px', '') + this.state.copyY - this.elems[this.state.id].offsetTop }px`
       this.elems[this.state.id].style.left = `${+this.elems[this.state.id].style.left.replace('px', '') + this.state.copyX - this.elems[this.state.id].offsetLeft }px`
       this.elems[this.state.id].style.zIndex = 0
       this.elems[this.state.id].className = "Move Mv"

       this.setState({id: null, touch: false})

       document.body.style.cursor = 'auto';
       document.removeEventListener('selectstart', this.disableSelect);
       document.removeEventListener('mousemove', this.onDragHandler)
       document.removeEventListener('mouseup', this.onMouseUpHandler)

       document.removeEventListener("touchmove", this.onDragHandler);
       document.removeEventListener("touchend", this.onMouseUpHandler);

     }

      render(){
        return <div><div className="Pool">{this.state.listJSX}</div><div>{this.state.list ? this.state.list.map((el, id)=>(`${id}:  ${el}`)) : null }</div></div>

      }
  }

MoveBoxes.propTypes = {
  list: PropTypes.array
}

MoveBoxes.defaultProps = {
  list: ['Python', 'Django', 'React','Javascript'],
  moveOutside: false,
  stopIfOutside: true
}

export default MoveBoxes;
