import React,{useState,useEffect,useContext} from 'react';
import './profile.css';
import {UserContext} from '../App';
function Profile() {
  const [myposts,setMyPosts]=useState([]);
  const {state,dispatch}=useContext(UserContext);
  useEffect(()=>{
    fetch("/myposts", {
      method:"get",
      headers: {
          "Authorization":"Bearer "+localStorage.getItem("token")
      }
  })
      .then(response => response.json())
      .then(function (data) {
         setMyPosts(data.posts);
          
          
      })
      .catch(error => {
          console.log(error);
      }) 
  },[])
  return (
    <div className='main-container'>
      <div className='profile-container'>
        <div> 
         <img style={{width:"165px" ,height:"165px",borderRadius:"83px",marginTop:"20%"}} src={state?state.profilePicUrl:"Loading..."} alt=''/>
        </div>
        <div className='details-section'>
          <h3>{state ?state.fullName:"Loading..."}</h3>
          <h3>{state ?state.email:"Loading..."}</h3>
          <div className='following'>
            <h6>{myposts.length} posts</h6>
            <h6>{state && state.hasOwnProperty('followers')?state.followers.length:0 } followers</h6>
            <h6>{state && state.hasOwnProperty('following')?state.following.length:0 } following</h6>
          </div>
          
        </div>
      </div>
      <div className='post-section'>
           
           { myposts.map((post)=>{
                      return(
                      <img src={post.image} className='posts' alt='' key={post._id}/>
           )})
                 

           }
              
           
          </div>
    </div>
  )
}

export default Profile;