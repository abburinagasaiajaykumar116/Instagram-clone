import React from 'react';
import {Link,useNavigate} from 'react-router-dom';
import { useState,useContext} from 'react';
import M from 'materialize-css';
import {UserContext} from '../App';
function Login() {
  const {state,dispatch}=useContext(UserContext);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate=useNavigate();
  const login=()=>{
    // eslint-disable-next-line
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      return  M.toast({ html:"Enter a valid Email!", classes: "#c62828 red darken-3" });
    }
    fetch("/login", {
      method: "post",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          email: email,
          password: password,
         
      })
  })
      .then(response => response.json())
      .then(function (data) {
          console.log(data);
          if (data.error) {
              M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          }
          else {
            localStorage.setItem("token",data.token);
            localStorage.setItem("UserInfo",JSON.stringify(data.UserInfo));
            dispatch({type:"USER",payload:data.UserInfo});
              M.toast({ html: "Login Successful!", classes: "#388e3c green darken-2" });
              navigate('/');
          
          }
      }).catch(error => {
          console.log(error);
      }) 
  
   
  }
  return (
    <div className='login-container'>
      <div className='card login-card'>
        <h2>Instagram</h2>
        
        <input type="email" placeholder="Enter Email" value={email} onChange={(event)=>setEmail(event.target.value)}/>
        <input type="password" placeholder="Enter Password" value={password} onChange={(event)=>setPassword(event.target.value)}/><br/><br/>
        <button onClick={()=>login()} className="waves-effect waves-light btn">Login</button>
        <h6><Link to="/signup">Don't  have an account?</Link></h6>
      


      </div>
      
    </div>
  )
}

export default Login;