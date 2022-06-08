import React from "react";

import "./chatbubble.css";

export default class ChatBubble extends React.Component{
    constructor(props){
        super(props);

        this.props = props;
    }

    render(){
        return(
        <div className="chatBubbleBackground">
            <div className="chatBubble"  style={{alignSelf: this.props.isLeft?"flex-start":"flex-end"}}>
                <p>{this.props.message}</p>
            </div>
        </div>
        )
    }
}