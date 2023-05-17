import React from 'react';
import { Link,useNavigate} from 'react-router-dom';
import { useState,useEffect } from 'react';
import M from 'materialize-css';
function Signup() {
  const [fullName,setfullName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [profilePic,setProfilePic]=useState("");
  const [url,setUrl]=useState(undefined);
 
  const navigate=useNavigate();
  useEffect(() => {
    if (url) {
        submitData()
    }
}, [url])

const uploadProfilePicture = () => {
    const formData = new FormData();
    formData.append("file", profilePic);
    formData.append("upload_preset", "insta-app-clone");
    formData.append("cloud_name", "instagramcloneapp");

    fetch("https://api.cloudinary.com/v1_1/instagramcloneapp/image/upload", {
        method: "post",
        body: formData
    }).then(response => response.json())
        .then(data => {
            setUrl(data.url);
            console.log(data);
        })
        .catch(error => console.log(error));
}

const submitData = () => {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        M.toast({ html: "Enter valid email!", classes: "#c62828 red darken-3" });
        return
    }
    fetch("/register", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fullName: fullName,
            email: email,
            password: password,
            profilePicUrl: url
        })
    })
        .then(response => response.json())
        .then(function (data) {
            console.log(data);
            if (data.error) {
                M.toast({ html: data.error, classes: "#c62828 red darken-3" });
            }
            else {
                M.toast({ html: data.result, classes: "#388e3c green darken-2" });
                navigate('/login');
            }
        }).catch(error => {
            console.log(error);
        })
}

const register = () => {
    if (profilePic) {
        uploadProfilePicture()
    } else {
        submitData()
    }
}

  return (
   

    <div className='login-container'>
      <div className='card login-card'>
        <h2>Instagram</h2>
      
        <input type="text" placeholder="Enter FullName" value={fullName} onChange={(event)=>setfullName(event.target.value)}/>
        <input type="email" placeholder="Enter Email" value={email} onChange={(event)=>setEmail(event.target.value)}/>
        <input type="password" placeholder="Enter Password" value={password} onChange={(event)=>setPassword(event.target.value)}/>
        <div className="file-field input-field">
        <div className="btn waves-effect waves-light btn">
            <span>profile Picture</span>
            <input type="file"  onChange={(event)=>setProfilePic(event.target.files[0])}/>
        </div>
        <div className="file-path-wrapper">
            <input className="file-path validate" type="text"/>
        </div></div><br/><br/>
        <button onClick={()=>register()} className="waves-effect waves-light btn">Signup</button>
        <h6><Link to="/login">Already have an account?</Link></h6>
      


      </div>
      
    </div>
  )
}

export default Signup;