import React from "react";
import "./SwipeWindow.css";

export default class SwipeWindow extends React.Component{
    constructor(props){
        super(props);
    
        this.props = props;
    
        this.currentDiv = 0

        this.state = {
            leftOfDiv:this.currentDiv * 0, 
            opacityOfDiv:Array(Array.isArray( this.props.children) ?this.props.children.length:1).fill(0), 
            windowWidth:window.innerWidth, 
            windowHeight:window.innerHeight, 
            parentWidth:0,
        }

        console.log(this.state)
        this.outOfViewEvent = this.props.OutOfViewEvent;

        this.slide = this.slide.bind(this);

        if(props.SlideFunc !== undefined && props.SlideFunc !== null)
            props.SlideFunc(this.slide);
    }

    componentDidMount(){
        window.addEventListener("resize", ()=>{
            this.setState({windowWidth:window.innerWidth, windowHeight:window.innerHeight, parentWidth:this.ref.clientWidth})
        })



        let arr = this.state.opacityOfDiv.map((elem)=>0) ;
        arr[0] = 1;

        
        this.setState({parentWidth:this.ref.offsetWidth,  opacityOfDiv: arr});
    }
    
    slide(to){
        if(to !== undefined)
        this.currentDiv = to;
        let arr = this.state.opacityOfDiv.map((elem)=>0) ;
        arr[to] = 1;

        this.setState({leftOfDiv:-this.ref.clientWidth * this.currentDiv, opacityOfDiv: arr })
    }
    
    render(){
        let key = 0;
        return(
                <div className={"SwipeWindowBackground " + this.props.className}  style={this.props.style} ref={ref => this.ref = ref}>
                    <div 
                        style={
                            {
                                transition:"1s", 
                                position:"relative", 
                                left:this.state.leftOfDiv, 
                                display:"flex", 
                                flexDirection:"row", 
                                width:this.state.parentWidth * (Array.isArray(this.props.children) ? this.props.children.length: 1), 
                                height:"100%"
                                }
                                }
                                >
                        {
                            Array.isArray(this.props.children) ?
                            this.props.children.map((elem)=> {
                                return React.cloneElement(elem, {key:key, className:elem.props.className + " SwipeBanner", style:{...elem.props.style ,width:this.state.parentWidth, opacity:this.state.opacityOfDiv[key++]}})
                            })
                            :
                            React.cloneElement(this.props.children === undefined? (<div/>):this.props.children, {key:key++, className: this.props.children.props.className + " SwipeBanner", style:{...this.props.children.props.style,width:this.state.parentWidth, opacity:this.state.opacityOfDiv[0]}})
                        }
                    </div>
                </div>
        );
    }
}