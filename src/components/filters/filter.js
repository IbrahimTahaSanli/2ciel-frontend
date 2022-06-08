import React from "react";

import "./filter.css";

export default class Filters extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            description:"",
            header:"",
            priceMin:"",
            priceMax:"",
            currency:""
        };

        this.props = props;

        this.getData = this.getData.bind(this);

        props.getData(this.getData);
    }

    onInputChange(item, value){
        let val = {}
        val[item] = value.target.value
        this.setState(val);
    }

    getData(){
        return {
                header:this.state.header,
                description:this.state.description,
                pricemin: this.state.priceMin,
                priceMax: this.state.priceMax,
                currency: this.state.currency
            }
        ;
    }

    getHeight(){
        return this.divRef.offsetHeight
    }

    render(){
        return (
            <div className="filtersDiv" ref={(ref)=> this.divRef = ref}>
                <input type="text" autoComplete="on" placeholder="Description Includes" size={30} onChange={elem=>this.onInputChange("description", elem)}></input>
                <input type="text" autoComplete="on" placeholder="Header Includes" size={30} onChange={elem=>this.onInputChange("header", elem)}></input>
                <input type="number" autoComplete="on" placeholder="Price Min" size={30} onChange={elem=>this.onInputChange("priceMin", elem)} min={0.0}></input>
                <input type="number" autoComplete="on" placeholder="Price Max" size={30} onChange={elem=>this.onInputChange("priceMax", elem)}></input>
                <input type="text" autoComplete="on" placeholder="Currency(ex:'₺')" size={30} onChange={elem=>this.onInputChange("currency", elem)}></input>
                <input type="button" value="Apply" onClick={()=>{
                    if(this.props.onSubmit !== undefined && this.props.onSubmit !== null)
                        this.props.onSubmit({
                                    header:this.state.header,
                                    description:this.state.description,
                                    pricemin: this.state.priceMin,
                                    pricemax: this.state.priceMax,
                                    currency: this.state.currency
                                }
                            );
                        
                    
                }}></input>
        </div>
        )
    }
}