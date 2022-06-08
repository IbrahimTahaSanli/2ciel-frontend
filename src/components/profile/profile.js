import React from "react";
import "./profile.css";

import SwipeWindow from "../swipeWindow/SwipeWindow";
import { toHaveAccessibleDescription } from "@testing-library/jest-dom/dist/matchers";
import SwipeWindowBackground from "../swipeWindowBackground/SwipeWindowBackground";



class Profile extends React.Component{
    constructor(props){
        super(props);

        this.props = props;
        
        this.getData = this.getData.bind(this);

        if(props.CloseWindow !== undefined && props.CloseWindow !== null)
            this.CloseWindow = props.CloseWindow;

        this.state = {
            data: {
                username:"",
                id:"",
                email:"",
                phone:"",
                postCount:"",
            }
        }
    }

    componentDidMount(){
        this.getData();
    }

    async getData(){
        let resp = await fetch("http://localhost:8090/profile/", 
        {
            credentials:"include",
            cache:"no-store",
        });
        
        this.setState( {data: await resp.json()});

    }

    onInputChange(item, value){
        let val = {}
        val[item] = value.target.value
        this.setState(val);
    }


    render(){
        return(
            <SwipeWindowBackground OutOfViewEvent={this.CloseWindow}>
                <SwipeWindow SlideFunc={(sli)=> this.slide = sli} className="profileWindowSwipe" >
                    <div className="profile1">
                        <h1>Welcome <span className="boldText">{this.props.user.username}</span></h1>
                        <p className="profile1P">Your ID is <span className="boldText">{this.state.data.id}</span></p>
                        <p className="profile1P">Registered with <span className="boldText">{this.state.data.email}</span></p>
                        <p className="profile1P">Your phone number is <span className="boldText">{this.state.data.phone}</span></p>
                        <p className="profile1P">You have posted <span className="boldText">{this.state.data.postCount}</span></p>
                        <input type="button" onClick={()=>{
                            this.props.LogoutEvent.forEach(element => {
                                element();
                            })
                            }
                        }
                        value="Logout"
                        ></input>
                    </div>
                </SwipeWindow>
            </SwipeWindowBackground>
        );
    }
}


export default Profile;