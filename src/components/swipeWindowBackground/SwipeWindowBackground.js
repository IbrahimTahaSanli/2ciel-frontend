import React from "react"

import "./SwipeWindowBackground.css";


export default class SwipeWindowBackground extends React.Component{
    constructor(props){
        super(props);

        this.props = props;
    }

    render(){
        return (
            <div className="SwipeWindow" style={this.props.style} onClick={(e)=>
            {
                if(e.target === e.currentTarget)
                    if(this.props.OutOfViewEvent !== undefined && this.props.OutOfViewEvent !== null)    
                        this.props.OutOfViewEvent.forEach((elem)=>elem());
                }
            }
            >
            {this.props.children}
            </div>)
    }

}

