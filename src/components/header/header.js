import React from "react";

import "./header.css"

class Header extends React.Component{
    constructor(props){
        super(props);

        this.props = props;
        this.elem = props.children;

        this.state = {

        }
    }

    componentrec

    render(){
        return (
            <div className="header">
                {this.props.children.map(
                    (elem) => {
                        if(elem === false)
                            return;
                        //console.log(elem.props.children);
                        return elem.type == "img" ? 
                        (<a key={elem.toString()} className="imgWrapper" href={elem.props.href} style={{"backgroundImage":"url("+elem.props.src+")"}}></a>) 
                        : React.cloneElement(elem, {key:elem.props.children, className:"otherWrapper"}) 
                    }
                        )}
            </div>
        ); 
    }
}
export default Header;