import React from "react";

import "./postInfo.css";

import SwipeWindow from "../swipeWindow/SwipeWindow";
import SwipeWindowBackground from "../swipeWindowBackground/SwipeWindowBackground";

export default class PostInfo extends React.Component{
    constructor(props) {
        super(props);

        this.props = props;
        this.parent = null;

        this.currentPage = 0;

        this.state = { mapTop:1080}

        this.MapClose = this.MapClose.bind(this);
        this.MapSwitch = this.MapSwitch.bind(this);

        this.mapDivRef = null;
        this.mainRef = null;
        this.mapSignRef = null;
    }
    
    componentDidMount(){
        this.MapClose()

        window.ymaps.ready(()=>{
            this.map = new window.ymaps.Map('map', {
                center: this.props.postInfo.position,
                zoom: 10
            }, {
                searchControlProvider: 'yandex#search'
            });

            let circle = new window.ymaps.Circle([this.props.postInfo.position, 10000],{},{dragable:true});
            this.map.geoObjects.add(circle);
        
        })

        window.addEventListener("resize", ()=>{
            this.MapClose()
        })

    }

    MapClose(){
        this.setState({mapTop: this.mainRef.offsetHeight - this.mapSignRef.offsetHeight })
    }

    MapSwitch(){
        let tmp = this.mainRef.offsetHeight - this.mapSignRef.offsetHeight;
        this.setState({
            mapTop: this.state.mapTop === tmp? this.mainRef.offsetHeight*0.1: tmp
        })
    }

    render(){
        console.log(this.props)
        return (
            <SwipeWindowBackground OutOfViewEvent={this.props.OutOfViewEvent}>
                <div className="postInfaFirstBackground" ref={ref=>this.mainRef = ref}>
                    <div className="postInfoImages">
                        <a 
                            className="postInfoArrows"
                        onClick={
                            ()=>{
                               this.currentPage = (this.currentPage - 1) < 0? (this.props.postInfo.images.length - 1) : (this.currentPage -1);
                               this.slide(this.currentPage);     
                            }
                        }>&#60;</a>
                        <SwipeWindow 
                        style={{width:"100%", height:"100%", backgroundColor:"transparent", position:"relative"}} 
                        SlideFunc={(func)=>this.slide = func}>
                        {
                            this.props.postInfo.images.map((elem)=>{
                                return <a key={elem.toString()} className="postImgs" href={elem} style={{"backgroundImage":"url("+elem+")", padding:0}}></a>
                            })
                        }

                        </SwipeWindow>
                        <a 
                            className="postInfoArrows"
                        onClick={
                            ()=>{
                               this.currentPage = this.currentPage + 1 >= this.props.postInfo.images.length? 0 : this.currentPage + 1;
                               this.slide(this.currentPage);     
                            }
                        }>&#x3e;</a>

                    </div>
                    <div className="postInfoDetails">
                        <h1>{this.props.postInfo.header}</h1>
                        <p>{this.props.postInfo.description}</p>

                        <h1>{this.props.postInfo.price} <span>{this.props.postInfo.currency}</span></h1>
                        <input type="button" onClick={(this.verifyUsername)} value="Send Message"></input>
                    </div>
                    <div className="postMapDiv" style={{top:this.state.mapTop}}>
                        <div className="postMapSignDiv" ref={ref => this.mapSignRef = ref} onClick={this.MapSwitch}>
                            <i class="material-icons postMapSign" >map</i>
                        </div>
                        <div id="map" ref={ref=>this.mapDivRef = ref}>

                        </div>
                    </div>
                </div>
            </SwipeWindowBackground>
        );
    }
}

/*

<div id='map' style={{width:"100%", height:"100%"}}>

            </div>

                
        window.ymaps.ready(()=>{
            var geolocation = window.ymaps.geolocation,
            myMap = new window.ymaps.Map('map', {
                center: [55, 34],
                zoom: 10
            }, {
                searchControlProvider: 'yandex#search'
            });
      
        geolocation.get({
          provider: 'yandex',
          mapStateAutoApply: true
      }).then(function (result) {
          // We'll mark the position calculated by IP in red.
          result.geoObjects.options.set('preset', 'islands#redCircleIcon');
          result.geoObjects.get(0).properties.set({
              balloonContentBody: 'My location'
          });
          myMap.geoObjects.add(result.geoObjects);
          let circle = new window.ymaps.Circle([result.geoObjects.position, 10000],{},{dragable:true});
      
        
      
      });
      
          geolocation.get({
          provider: 'browser',
          mapStateAutoApply: true
      }).then(function (result) {
      
          console.log(result);
          result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
          myMap.geoObjects.add(result.geoObjects);
          let circle = new window.ymaps.Circle([result.geoObjects.position, 1000], {},{        draggable: true,});
          circle.events.add("dragend", (e)=> console.log(e.originalEvent.target.geometry._coordinates));
          myMap.geoObjects.add(circle);
      
        });)
*/