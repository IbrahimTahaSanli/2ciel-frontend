import React from "react";
import "./popup.css";


export default class Popup extends React.Component{
    constructor(props){
        super(props);
    
        this.defaultTimeout = props.defaultTimeout;

        this.state = {
            message:"",
            code:"",
            opacity:0,
            z:-100000
        }

        this.warningFunction = this.warningFunction.bind(this);
        this.hidePopout = this.hidePopout.bind(this);

        if(props.controls !== undefined){
            props.controls(this.warningFunction, this.hidePopout)
        }

        this.time = null;
    }

    warningFunction(text){
        this.setState({message:text, opacity:1, z:999999999});

        this.time = setTimeout(this.hidePopout, this.defaultTimeout );
    }

    hidePopout(){
        if(this.time !== undefined && this.time !== null)
            clearTimeout(this.time);
        this.setState({opacity:0});
        setTimeout(()=>this.setState({z:-1000000}), 1000);
    }


    render(){
        return (
            <div className="popupParent" style={{opacity:this.state.opacity, zIndex: this.state.z}}>
                <div style={{padding:"3%", overflowY:"scroll"}}>
                    <p className="popoutText">{this.state.message}</p>
                </div>

            </div>
        )
    }
} 