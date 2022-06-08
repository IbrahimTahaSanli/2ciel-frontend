import React from "react";

import "./messagefolder.css";
import Messages from "./messages";

export default class MessageFolder extends React.Component{
    constructor(props){
        super(props);

        this.state = {divBottom: -1080, rotate:"0deg", messages:[]}

        this.MessageFolderSwitch = this.MessageFolderSwitch.bind(this);
        this.MessageFolderClose = this.MessageFolderClose.bind(this);

        this.Refresh = this.Refresh.bind(this);

        props.Refresh(this.Refresh);
    }

    componentDidMount(){
        this.MessageFolderClose()

        window.addEventListener("resize", ()=>{
            this.MessageFolderClose()
        })

        let resp = fetch("http://localhost:8090/messages/getusermessages", {
            credentials:"include",
            method:"GET",
        }).then((resp)=> resp.json()).then((json)=>this.setState({messages:json}))
    }

    MessageFolderClose(){
        this.setState({divBottom:-this.MessagesRef.offsetHeight,
            rotate: "rotate(180deg)"
        })
    }

    Refresh(){
        let resp = fetch("http://localhost:8090/messages/getusermessages", {
            credentials:"include",
            method:"GET",
        }).then((resp)=> resp.json()).then((json)=>this.setState({messages:json}))
    }

    MessageFolderSwitch(){
        this.setState({divBottom:this.state.divBottom !== 0 ? 0:-this.MessagesRef.offsetHeight,
            rotate: this.state.divBottom !== 0?"rotate(0deg)":"rotate(180deg)"
        });
    }

    render(){
        return (
        <div className="messageFolderBackground" style={{bottom:this.state.divBottom}}>
            <div className="messageFolderHeader" onClick={this.MessageFolderSwitch}>
                <p>Messages</p>
                <p className="messageFolderHeaderArrow" style={{transform: this.state.rotate }}>&#709;</p>
            </div>
            <div className="messageFolderMessages" ref={(ref)=>this.MessagesRef = ref}>
                {
                    this.state.messages.map((elem)=>(
                    <Messages onClick={this.props.startChat} chatID={elem.ID} users={elem.users.filter((el)=>el !== this.props.user.username)} lastMessage={elem.messages[0] !== null?elem.messages[0].message: "NaN"}></Messages>))
                }
            </div>
        </div>);
    }

}