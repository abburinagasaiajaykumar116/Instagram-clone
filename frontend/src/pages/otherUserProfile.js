import React,{useState,useEffect,useContext} from 'react';
import './profile.css';
import {UserContext} from '../App';
import {useParams} from 'react-router-dom';
function OtherProfile() {
  const [userProfile,setuserProfile]=useState();
  const {state,dispatch}=useContext(UserContext);
  const {userId}=useParams();
  const [showFollow,setShowFollow]=useState(state?!state.following.includes(userId):true);
  useEffect(()=>{
    fetch(`/user/${userId}`, {
      method:"get",
      headers: {
          "Authorization":"Bearer "+localStorage.getItem("token")
      }
  })
      .then(response => response.json())
      .then(function (data) {
         
          setuserProfile(data);
      })
      .catch(error => {
          console.log(error);
      }) 
  },[])
  const follow = () => {
    fetch('/follow', {
        method: "put",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ followId: userId })

    })
        .then(response => response.json())
        .then(function (updatedUser) {
            console.log(updatedUser);
            dispatch({ type: "UPDATE", payload: { following: updatedUser.following, followers: updatedUser.followers } })
            localStorage.setItem("UserInfo", JSON.stringify(updatedUser))

            setuserProfile((prevState) => {
                return {
                    ...prevState, //expand current state i.e it has user and post info
                    user: {
                        ...prevState.user,
                        //update the followers count by adding the loggedin user id into the followers list of Other user
                        followers: [...prevState.user.followers, updatedUser._id]
                    }
                }
            })
            setShowFollow(false);
        }).catch(error => {
            console.log(error);
        });
}
const unfollow = () => {
  fetch('/unfollow', {
      method: "put",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({ unfollowId: userId })

  })
      .then(response => response.json())
      .then(function (updatedUser) {
          console.log(updatedUser);
          debugger;
          dispatch({ type: "UPDATE", payload: { following: updatedUser.following, followers: updatedUser.followers } })
          localStorage.setItem("userInfo", JSON.stringify(updatedUser))

          setuserProfile((prevState) => {
              const updatedFollowers = prevState.user.followers.filter(uid => uid != updatedUser._id)
              return {
                  ...prevState, //expand current state i.e it has user and post info
                  user: {
                      ...prevState.user,
                      //update the followers count by removing the loggedin user id into the followers list of Other user
                      followers: updatedFollowers
                  }
              }
          })
          setShowFollow(true);
      }).catch(error => {
          console.log(error);
      });
}
  return (
    <>
    {   
        userProfile
        ? <div className='main-container'>
        <div className='profile-container'>
          <div> 
           <img style={{width:"165px" ,height:"165px",borderRadius:"83px",marginTop:"20%"}} src={userProfile.user.profilePicUrl} alt=''/>
          </div>
          <div className='details-section'>
            <h3>{userProfile.user.fullName}</h3>
            <h5>{userProfile.user.email}</h5>
            <div className='following'>
              <h6>{userProfile.posts.length} posts</h6>
              <h6>{userProfile.user.followers.length} followers</h6>
              <h6>{userProfile.user.following.length} following</h6>
            </div>
            {
              showFollow
              ? <button style={{margin:"10px"}} onClick={()=>follow()} className="waves-effect waves-light btn #1565c0 blue darken-3">Follow</button>
              : <button style={{margin:"10px"}} onClick={()=>unfollow()} className="waves-effect waves-light btn #1565c0 blue darken-3">Unfollow</button>
            
            }
           
           
          </div>
        </div>
        <div className='post-section'>
             
             { userProfile.posts.map((post)=>{
                        return(
                        <img src={post.image} className='posts' alt='' key={post._id }/>
             )})
                   
  
             }
              </div>
            </div>
                
        :<h5>Loading...</h5>
    
    
    
    }
    
    </>
   
           
         
  )
}

export default OtherProfile;