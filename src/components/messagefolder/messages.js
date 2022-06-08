import React from "react";
import "./messages.css";

export default class Messages extends React.Component{
    constructor(props){
        super(props);

        this.props = props;
    }

    render(){
        return (
            <div className="messagesDiv" onClick={()=>this.props.onClick(this.props.chatID)}>
                <h1 className="messagesUsers">{this.props.users}</h1>
                <p className="messagesLastMessages">{this.props.lastMessage}</p>
            </div>
        )
    }
}