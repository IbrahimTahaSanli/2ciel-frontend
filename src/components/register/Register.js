import React from "react";
import "./Register.css"

import SwipeWindowBackground from "../swipeWindowBackground/SwipeWindowBackground";
import SwipeWindow from "../swipeWindow/SwipeWindow";


class Register extends React.Component{
    emailReg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    phoneReg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

    constructor(props){
        super(props);

        this.props = props;
        
        this.currentDiv = 0

        this.state = {
            Email:"",
            Password:"",
            Password1:"",
            Username:"",
            Phone: "",
        }

        this.PopoutWarn = props.WarningPopout;
        this.PopoutHide = props.HidePopout

        this.loading = props.loading;

        this.registerEvent = props.RegisterEvent === undefined? []: props.RegisterEvent ;
        this.failEvent = props.FailEvent === undefined? []: props.FailEvent

        this.verifyUsername = this.verifyUsername.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
        this.verifyPhone = this.verifyPhone.bind(this);
        this.verifyPassword = this.verifyPassword.bind(this);

        this.tryToRegister = this.tryToRegister.bind(this);
        this.onInputChange = this.onInputChange.bind(this);

    }

    componentDidMount(){
    }

    async verifyUsername(){
        if( this.state.Username.length < 10 || this.state.Username.length > 40 )
            return this.PopoutWarn("Username length must be between 10 to 40 character");

        let resp = await fetch("http://localhost:8090/register/verifyusername", {
            credentials:"include",
            method:"POST",
            body:JSON.stringify({
                username:this.state.Username
            })
        })

        switch(resp.status){
            case(400):
                return this.PopoutWarn("400: Bad Request");
            case(404):
            case(403):
                return this.PopoutWarn("Wrong Crediantials");
            case(409):
                return this.PopoutWarn("Username exists");
            case(500):
                return this.PopoutWarn("Internal Server Error Apologize For Waiting");
            case(200):
                this.Slide(1);

                break;
        }
    }

    async verifyEmail(){
        if(!this.state.Email.match(this.emailReg))
            return this.PopoutWarn("E-mail adrress wrong");

        let resp = await fetch("http://localhost:8090/register/verifyemail", {
            credentials:"include",
            method:"POST",
            body:JSON.stringify({
                email:this.state.Email
            })
        })

        switch(resp.status){
            case(400):
                return this.PopoutWarn("400: Bad Request");
            case(404):
            case(403):
                return this.PopoutWarn("Wrong Crediantials");
            case(409):
                return this.PopoutWarn("Email exists");
            case(500):
                return this.PopoutWarn("Internal Server Error Apologize For Waiting");
            case(200):
                this.Slide(2);
                break;
        }
    }

    async verifyPhone(){
        if(!this.state.Phone.match(this.phoneReg))
            return this.PopoutWarn("Phone number wrong");

        this.Slide(3);
    }

    async verifyPassword(){
        if(this.state.Password.length < 10 || this.state.Password > 24)
            return this.PopoutWarn("Password lengtrh must be between 10 and 24 character");
        if(this.state.Password !== this.state.Password1)
            return this.PopoutWarn("Passwords wont match");
        
        this.tryToRegister();
    }

    async tryToRegister(){
        if(!this.state.Email.match(this.emailReg))
            return this.PopoutWarn("E-mail adrress wrong");
            
        if(!(this.state.Password.length < 20))
            return this.PopoutWarn("Password worng");

        let resp = await fetch("http://localhost:8090/register", {
            credentials:"include",
            method:"POST",
            body:JSON.stringify({
                email:this.state.Email,
                username:this.state.Username,
                phone:this.state.Phone,
                password:this.state.Password
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
                return this.Slide(4);
        }
    }

    onInputChange(item, value){
        let val = {}
        val[item] = value.target.value
        this.setState(val);
    }

    render(){
        return(
            <SwipeWindowBackground OutOfViewEvent={this.failEvent}>                
                <SwipeWindow SlideFunc={(sli)=> this.Slide = sli}>
                    <div>
                        <h1>Welcome</h1>
                        <p>Lets start with your username</p>
                        <input type="text" autoComplete="on" placeholder="Username" size={30} onChange={elem=>this.onInputChange("Username", elem)}></input>
                        <input type="button" onClick={(this.verifyUsername)} value=">"></input>
                    </div>
                    <div>
                        <p>Now we need an email to reach you.</p>
                        <input type="email" autoComplete="on" placeholder="E-Mail" size={30} onChange={elem=>this.onInputChange("Email", elem)}></input>
                        <input type="button" onClick={()=>this.Slide(0)} value="<"></input>
                        <input type="button" onClick={this.verifyEmail} value=">"></input>
                    </div>
                    <div>
                        <p>We need a phone number for verify this is you</p>
                        <input type="text" autoComplete="on" placeholder="Phone Number" size={30} onChange={elem=>this.onInputChange("Phone", elem)}></input>
                        <input type="button" onClick={()=>this.Slide(1)} value="<"></input>
                        <input type="button" onClick={this.verifyPhone} value=">"></input>

                    </div>
                    <div>
                        <p>Lets set you up with a password</p>
                        <input type="password" autoComplete="on" placeholder="Password" size={30} onChange={elem=>this.onInputChange("Password", elem)}></input>
                        <input type="password" autoComplete="on" placeholder="Password(again)" size={30} onChange={elem=>this.onInputChange("Password1", elem)}></input>
                        <input type="button" onClick={()=>this.Slide(2)} value="<"></input>
                        <input type="button" onClick={(this.verifyPassword)} value=">"></input>

                    </div>
                    <div>
                        <h1>Congrats </h1>
                        <p>Your account have been created you can login in homescreen.</p>
                        <input type="button" onClick={()=>this.registerEvent.forEach(element => {
                            element();
                        })} value=">"></input>

                    </div>
                </SwipeWindow>
            </SwipeWindowBackground>

        );
    }
}

export default Register;