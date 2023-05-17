import React,{useEffect,createContext,useReducer, useContext} from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter,Route,Routes,useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import {intialState,reducer} from './Reducer/userreducer';
import './App.css';
import CreatePost from "./pages/CreatePost";
import OtherProfile from "./pages/otherUserProfile";
import Postsfromfollowing from "./pages/Postsfromfollowing";
export const UserContext=createContext();
const CustomRouting=()=>{
  const history=useNavigate();
  const {state,dispatch}=useContext(UserContext); 
  useEffect(()=>{
  const UserInfo=JSON.parse(localStorage.getItem("UserInfo"));
  if(UserInfo){
   
    dispatch({type:"USER",payload:"UserInfo"});
    
  }else{
    history('/login');
  }

  },[])
  return(
    <Routes>
      <Route  exact path="/" element={<Home/>}/>
       <Route exact path="/login" element={<Login/>}/>
       <Route exact path="/signup" element={<Signup/>}/>
       <Route exact path="/profile" element={<Profile/>}/>
       <Route exact path="/postsfromfollowing" element={<Postsfromfollowing/>}/>
       <Route exact path="/profile/:userId" element={<OtherProfile/>}/>
       <Route exact path="/create-post" element={<CreatePost/>}/>
    </Routes>
    
     
     
  )
}
function App() {
  const [state,dispatch]=useReducer(reducer,intialState);
  return (
   <UserContext.Provider value={{state:state,dispatch:dispatch}}>
     <BrowserRouter>
       
       <Navbar/>
       <CustomRouting/>
      
    </BrowserRouter>
      
   </UserContext.Provider>
  
  );
}

export default App;
