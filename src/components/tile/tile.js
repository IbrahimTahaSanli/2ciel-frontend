import React  from "react";
import "./tile.css"

class Tile extends React.Component{
    constructor(props){
        super(props);

        this.props = props;

        this.onDivClick = this.onDivClick.bind(this);
    }

    onDivClick(event){
        if(event.target !== this.button && event.target !== this.message)
            if(this.props.OnDivClick !==undefined || this.props.OnDivClick !== null)    
                this.props.OnDivClick.forEach((elem)=>elem());
    }

    render(){
        return (
            <div className="tileSelf" onClick={this.onDivClick}>
                <div className="productImage" style={{backgroundImage: "url(" + this.props.imageUrl + ")"}}/>
                <h1>{this.props.header}</h1>
                <p className="tilePrice"><span>Price: </span>{this.props.price} <span>{this.props.currency}</span></p>
                <div className="tileMessage" onClick={this.props.MessageClick} ref={ref => this.button = ref}>
                    <a className="tileMessageText"  ref={ref => this.message = ref}>
                        Message
                    </a>
                </div>
            </div>
        );
    }
}
export default Tile;