import React from "react";

import "./chat.css";
import ChatBubble from "./chatbubble";

export default class Chat extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            top: 1080, 
            rotate:"0deg", 
            data:null, 
            isLoaded:false, 
            opacity: 0,
            text: ""
        }

        this.props = props;

        this.headerRef = null;
        this.inputRef = null;

        this.sendMessage = this.sendMessage.bind(this);
        
        this.ChatSwitch = this.ChatSwitch.bind(this);
        this.ChatOpen = this.ChatOpen.bind(this);

        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange(item, value){
        let val = {}
        val[item] = value.target.value
        this.setState(val);
    }

    componentDidMount(){
        this.ChatOpen()

        window.addEventListener("resize", ()=>{
            this.ChatClose()
        })

        this.headerRef.addEventListener("wheel", this.props.headerScrollEvent);

        fetch("http://localhost:8090/messages/getchat", {
            credentials:"include",
            method:"POST",
            body:JSON.stringify({
                chatid:this.props.chatID
            })
        }).then((resp)=>resp.json()).then((json)=>this.setState({data:json, isLoaded:true, opacity:1}))
    }

    async sendMessage(){
        let resp = await fetch("http://localhost:8090/messages/sendmessage", {
            credentials:"include",
            method:"POST",
            body:JSON.stringify({
                chatid:this.props.chatID,
                message: this.state.text
            })
        })

        switch(resp.status){
            case(400):
                return this.PopoutWarn("400: Bad Request");
            case(404):
            case(403):
                return this.PopoutWarn("Wrong Crediantials");
            case(500):
                return this.PopoutWarn("Internal Server Error Apologize For Waiting");
            case(200):
                this.inputRef.value = "";
                resp = await fetch("http://localhost:8090/messages/getchat", {
                    credentials:"include",
                    method:"POST",
                    body:JSON.stringify({
                        chatid:this.props.chatID,
                        timestamp: this.state.data.messages.length === 0 ? 0:this.state.data.messages[this.state.data.messages.length-1].timestamp
                    })})
                let json = await resp.json();
                
                this.state.data.messages = [...this.state.data.messages, ...json.messages];
                this.setState({data:this.state.data});
                break;
        }
    }

    ChatOpen(){
        this.setState({top:this.MessagesRef.offsetHeight,
            rotate: "rotate(0deg)"
        })
    }

    ChatSwitch(){
        this.setState({top:this.state.top !== 0 ? 0:this.MessagesRef.offsetHeight,
            rotate: this.state.divBottom !== 0?"rotate(0deg)":"rotate(180deg)"
        });
    }

    render(){
        return (
        <div className="chatBackground" style={{...this.props.style,bottom:this.state.top, opacity:this.state.opacity}}>
            <div className="chatHeader" onClick={this.ChatSwitch} ref={(ref)=> this.headerRef = ref}>
                <p>{this.state.isLoaded ? this.state.data.users.filter((e)=> e !==this.props.currentUser.username):""}</p>
                <p onClick={()=>this.props.closeChat(this.state.data.ID)} className="chatHeaderArrow" style={{transform: this.state.rotate }}>X</p>
            </div>
            <div className="chatMessages" ref={(ref)=>this.MessagesRef = ref}>
                {
                    this.state.isLoaded && this.state.data.messages.map((elem)=>
                        <ChatBubble message={elem.message} isLeft={this.props.currentUser.username !== elem.userID}></ChatBubble>
                    )
                }
            </div>
            <div className="chatInputDiv">
                <input type="text" autoComplete="on" placeholder="Insert Message" size={300} onChange={elem=>this.onInputChange("text", elem)} style={{width:"90%"}} ref={(ref)=>this.inputRef = ref}></input>
                <input type="button" value=">" style={{width:"10%"}} onClick={this.sendMessage}></input>
            </div>
        </div>);
    }

}