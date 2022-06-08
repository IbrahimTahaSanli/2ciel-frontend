import filterSign from './filter.svg';
import logo from "./logo.svg"
import './App.css';
import React from 'react';

import Header from "./components/header/header";
import Filters from "./components/filters/filter";

import Login from "./components/login/login";
import Profile from "./components/profile/profile";
import Register from "./components/register/Register";


import Tile from "./components/tile/tile";

import Popup from "./components/popup/popup";
import SwipeWindow from './components/swipeWindow/SwipeWindow';
import SwipeWindowBackground from './components/swipeWindowBackground/SwipeWindowBackground';
import PostInfo from './components/postInfo/postInfo';
import MessageFolder from './components/messagefolder/messagefolder';
import Chat from './components/chat/chat';

const PAGEITEMCOUNT = 24;

class App extends React.Component{
  constructor(props){
    super(props);
    this.props = props;

    this.user = null;

    this.state = {
      posts: [],
      chats: [],
      
      isLoading: true,
      isLogin: false,
      isWarning: true,
      isProfile: false,
      isPostInfo: undefined,

      canFetchNewPost: false,

      isBottom: false,

      loadingBackgroundColor: "#61dafb",
      userName: "Login",

      filterTop:0,
      postsSize:0,

    }

    this.filterOpenClose = this.filterOpenClose.bind(this);
    this.filterClose = this.filterClose.bind(this);

    this.postsScrollEvent = this.postsScrollEvent.bind(this);
    this.chatsScrollEvent = this.chatsScrollEvent.bind(this);

    this.getPosts = this.getPosts.bind(this);
    this.getNewPosts = this.getNewPosts.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    
    this.LoginWithToken = this.LoginWithToken.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this.messageToPost = this.messageToPost.bind(this);
    this.startChat = this.startChat.bind(this);
    this.closeChat = this.closeChat.bind(this);



    this.key = 0;

    this.currentLength = 1;

    this.header = null;
    this.filterRef = null;
    this.filterSignRef = null;
    this.fitAllRef = null;
    this.messageFolderRef = null;
    this.chatsRef = null;


    this.WarningPopout = null;
    this.HidePopout = null;
  
    this.messageFolderRefresh = null;
  };

  componentDidMount(){
    this.getPosts(this.getFilterData(), this.currentLength).then(
      (data)=>{
        this.setState({posts: data, isLoading:false, loadingBackgroundColor: "#61dafbaa", canFetchNewPost:true}) //, isPostInfo:data[7]
      }
      )
      ;

    this.LoginWithToken();

    this.setState({
      filterTop: this.state.filterTop === 0 ? -this.filterRef.getHeight(): 0,
      postsSize: this.state.filterTop === 0 ? this.fitAllRef.clientHeight - this.filterSignRef.clientHeight: this.fitAllRef.clientHeight - this.filterRef.getHeight() - this.filterSignRef.clientHeight  
    })

    window.addEventListener("resize", ()=>{
      this.filterClose()
  })

  }

  filterOpenClose(){
    this.setState({
      filterTop: this.state.filterTop === 0 ? -this.filterRef.getHeight(): 0,
      postsSize: this.state.filterTop === 0 ? this.fitAllRef.clientHeight - this.filterSignRef.clientHeight: this.fitAllRef.clientHeight - this.filterRef.getHeight() - this.filterSignRef.clientHeight  
    })
  }

  filterClose(){
    this.setState({
      filterTop:-this.filterRef.getHeight(),
      postsSize: this.fitAllRef.clientHeight - this.filterSignRef.clientHeight
    })
  }

  applyFilter(filters){
    this.setState({posts:[]})
    this.currentLength=1
    this.getPosts(filters, this.currentLength).then((elem)=>{
      this.setState({posts:elem, canFetchNewPost: elem.length > PAGEITEMCOUNT});
      this.isFetchingNewPosts = false;
    })

  }

  async getPosts(filters, index){
    return new Promise( (resolve, reject)=>{ fetch(
      ("http://localhost:8090/buy?description="+filters.description+"&&header="+filters.header+"&&pricemin="+parseFloat(filters.pricemin)+"&&pricemax="+parseFloat(filters.pricemax)+"&&currency"+filters.currency+"&&index="+((index-1) * PAGEITEMCOUNT)+"&&length=" + (index * PAGEITEMCOUNT)) ,
      {
        credentials:"same-origin",
        cache:"no-store"
      })
      .then(
        (elem)=>elem.json()).then(
          (elem)=> {
            resolve(elem);
          }).catch((elem)=>reject(elem));
          });
  }

  async getNewPosts(){
    this.getPosts(this.getFilterData(),this.currentLength + 1).then(
      (elem)=>{
        if(elem.length === 0){
          this.setState({ canFetchNewPost: false})
          this.WarningPopout("Cant fetch new post");
          return;
        }
        this.currentLength += 1;
        this.setState(sta=>({
          posts: [...sta.posts, ...elem]
        }))

        this.postsRef.scrollBy({top:-this.newPosterLoader.clientHeight,behavior: 'smooth'});
        this.isFetchingNewPosts = false;

    })
  }

  login(userData){
    this.user = userData
  }

  logout(){
    document.cookie = "access-token=;expires=0;Domain=localhost;"
    document.cookie = "refresh-token=;expires=0;Domain=localhost;Path=/relogin"
    this.user = null;

    this.setState({isProfile:false,user:null})
  }

  async LoginWithToken(){
    fetch("http://localhost:8090/tokenlogin",
      {
        credentials:"include"
      }
    ).then((elem)=>elem.json()
    ).then((elem)=>{
      this.login(elem);
    })
  }

  postsScrollEvent(eve){
    if( this.state.canFetchNewPost && !this.isFetchingNewPosts && (window.innerHeight > this.newPosterLoader.getBoundingClientRect().y) ){
      this.isFetchingNewPosts = true;
      this.getNewPosts()
    }
  }

  chatsScrollEvent(e){
    console.log(this.chatsRef.scrollLeft)
    if (e.deltaY < 0) this.chatsRef.scrollLeft -= 10;
    else this.chatsRef.scrollLeft += 10;
  }

  async messageToPost(postId){
    let resp = await fetch("http://localhost:8090/messages/createchat", {
      credentials:"include",
      method:"POST",
      body:JSON.stringify({
          postid:postId
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
          break;
    }

    let json = await resp.json();

    this.messageFolderRefresh();
    this.startChat(json.ID);
  }

  startChat(chatID){
    this.setState({chats:[...this.state.chats, chatID]})
  }

  closeChat(chatID){
    console.log(this.state.chats.filter((e)=>e!==chatID))
    this.setState({chats: this.state.chats.filter((e)=>e!==chatID)})
  }

  render(){
    return(
      <div className='wrapper'>
        <div className="App">
          <Header className="App-header" ref={ref=> this.header = ref}>
            <img src="/logo.png" href="/"/>
            {this.user === null &&<p onClick={
              ()=>this.setState({isRegister:true})
            }>Register</p>
            }<p>Sell</p>
            <p onClick={()=>this.setState(this.user === null?{isLogin:true}:{isProfile:true})}>{this.user === null?"Login":this.user.username}</p>
          </Header>
          <div className="fittAll" style={{top:this.state.filterTop}} ref={(ref)=> this.fitAllRef = ref}>
            <div className='filterSection' >
              <Filters 
                onSubmit={
                  this.applyFilter
                }

                ref={(ref)=> this.filterRef = ref}

                getData={(func)=>this.getFilterData = func}
              />


              <div className='filterSignDiv' onClick={this.filterOpenClose} ref={(ref)=>this.filterSignRef = ref}>
                <img src={filterSign} alt="filters" className='filterSign'/>
              </div>
            </div>
            <div className='posts' style={{height:this.state.postsSize}} ref={ref=> this.postsRef = ref} onScroll={this.postsScrollEvent}>
              { 
                this.state.posts.map((elem) => (
                  <Tile 
                    key = {this.key++}
                    header={elem.header}
                    imageUrl={elem.images.length == 0 ? null: elem.images[0]}
                    price={elem.price}
                    currency = {elem.currency}

                    startChat= {this.startChat}
                    OnDivClick = {[
                      ()=>this.setState({isPostInfo:elem})
                    ]}

                    MessageClick = {()=>this.messageToPost(elem.id)}
                  />
                ) )
              }
              
              { 
                this.state.canFetchNewPost &&
                <div className='newPostLoader' ref={ref=>this.newPosterLoader = ref}>
                  <img src={logo} className="App-logo newPostLoaderLoadSign" ></img>
                </div>
              }
              </div>
          </div>

        </div>
        {this.state.isLoading &&
          <div id='loadScreen' style={{backgroundColor:this.state.loadingBackgroundColor,zIndex:1000000000000000}}>
            <img src={logo} className="App-logo"></img>
          </div>
        }

        <Popup 
          defaultTimeout={5000}
          controls={(warni, hide)=>{
          this.WarningPopout = warni;
          this.HidePopout = hide;
        }}/>
        {
          this.state.isLogin && 
          <Login 
            WarningPopout={this.WarningPopout} 
            HidePopout={this.HidePopout} 
            LoginEvent={[this.login, (user)=>this.setState({isLogin:false})]}
            FailEvent={[()=>this.setState({isLogin:false})]}
          />
        }

        {
          this.state.isRegister &&
          <Register
            WarningPopout={this.WarningPopout} 
            HidePopout={this.HidePopout} 
            RegisterEvent={[()=>this.setState({isRegister:false})]}
            FailEvent={[()=>this.setState({isRegister:false})]}
          />
        }

        {
          this.state.isProfile &&
          <Profile
            user={this.user} 
            CloseWindow={[()=>this.setState({isProfile:false})]}
            LogoutEvent={[this.logout]}
          />
        }

        {
          this.state.isPostInfo !== undefined &&
          <PostInfo OutOfViewEvent={[()=>this.setState({isPostInfo:undefined})]} postInfo={this.state.isPostInfo}>

          </PostInfo>
  
        }

        {
          this.user !== null && 
          <MessageFolder Refresh={(ref)=>this.messageFolderRefresh = ref} startChat={this.startChat} user={this.user} ref={(ref)=>this.messageFolderRef = ref}>

          </MessageFolder>

        }

        <div className='chats' ref={(ref) => this.chatsRef = ref}>
          {this.state.chats.map((elem)=>
            <Chat currentUser={this.user} chatID={elem} closeChat={this.closeChat}></Chat>
          )}
        </div>

      </div>
    );
  }
};


export default App;
