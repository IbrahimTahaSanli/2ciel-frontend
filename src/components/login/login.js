import React from "react";
import "./login.css"

class Login extends React.Component{
    emailReg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    constructor(props){
        super(props);

        this.props = props;
        
        this.currentDiv = 0

        this.ref = NaN;

        this.state = {
            leftOfDiv:this.currentDiv * 0, 
            opacityOfDiv:[0,0], 
            windowWidth:window.innerWidth, 
            windowHeight:window.innerHeight, 
            parentWidth:0,
            Email:"",
            Password:""
        }

        this.PopoutWarn = props.WarningPopout;
        this.PopoutHide = props.HidePopout

        this.loading = props.loading;

        this.loginEvent = props.LoginEvent === undefined? []: props.LoginEvent ;
        this.failEvent = props.FailEvent

        this.slide = this.slide.bind(this);
        this.tryToLogin = this.tryToLogin.bind(this);
        this.onInputChange = this.onInputChange.bind(this);

    }

    componentDidMount(){
        window.addEventListener("resize", ()=>{
            this.setState({windowWidth:window.innerWidth, windowHeight:window.innerHeight, parentWidth:this.ref.clientWidth})
        })
        let arr = this.state.opacityOfDiv.map((elem)=>0) ;
        arr[0] = 1;
        this.setState({parentWidth:this.ref.clientWidth,  opacityOfDiv: arr});
    }

    slide(to){
        if(to !== undefined)
            this.currentDiv = to;
        let arr = this.state.opacityOfDiv.map((elem)=>0) ;
        arr[to] = 1;
        this.setState({leftOfDiv:-this.ref.clientWidth * this.currentDiv, opacityOfDiv: arr })
    }
 
    async tryToLogin(){
        if(!this.state.Email.match(this.emailReg))
            return this.PopoutWarn("E-mail adrress wrong");

            
            
        if(!(this.state.Password.length < 20))
            return this.PopoutWarn("Password worng");

        let resp = await fetch("http://localhost:8090/login", {
            credentials:"include",
            method:"POST",
            body:JSON.stringify({
                email:this.state.Email,
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
                let user = await resp.json();
                return this.loginEvent.forEach(element => {
                    element(user);
                }); 
        }
    }

    onInputChange(item, value){
        let val = {}
        val[item] = value.target.value
        this.setState(val);
    }

    render(){
        return(
            <div className="login" onClick={(e)=>
            {
                if(e.target === e.currentTarget)
                    this.failEvent.forEach((elem)=>elem())}
            }
            >
                <div className="loginBackground" ref={ref => this.ref = ref}>
                    <div style={{transition:"1s", position:"relative", left:this.state.leftOfDiv, display:"flex", flexDirection:"row", width:this.state.parentWidth * 2, height:"100%"}}>
                        <div className="loginBanner" style={{width:this.state.parentWidth, opacity:this.state.opacityOfDiv[0]}}>
                            <h1>Login</h1>
                            <input type="email" autoComplete="on" placeholder="E-Mail" size={30} onChange={elem=>this.onInputChange("Email", elem)}></input>
                            <input type="password" autoComplete="on" placeholder="Password" size={30} onChange={elem=>this.onInputChange("Password", elem)}></input>
                            <input type="button" onClick={(this.tryToLogin)}></input>
                        </div>
                    </div>
                </div>
    
            </div>
        );
    }
}

export default Login;