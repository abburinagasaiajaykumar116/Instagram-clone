import React,{useEffect, useState} from 'react';
import './Createpost.css';
import M from 'materialize-css';
import { useNavigate } from 'react-router-dom';
function CreatePost() {
  const [title,setTitle]=useState("");
  const [body,setBody]=useState("");
  const [image,setImage]=useState("");
  const navigate=useNavigate();
  useEffect(()=>{
     if(image){
      fetch("/createpost", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization":"Bearer "+localStorage.getItem("token")
        },
        body: JSON.stringify({
              title:title,
              body:body,
              image:image
           
        })
    })
        .then(response => response.json())
        .then(function (data) {
            if (data.error) {
                M.toast({ html: data.error, classes: "#c62828 red darken-3" });
            }
            else {
                M.toast({ html:"Post created successfully!", classes: "#388e3c green darken-2" });
                navigate('/');
            
            }
        }).catch(error => {
            console.log(error);
        }) 
    
     }
  },[image]);
  const Submitpost=()=>{
    const formdata =new FormData();
    formdata.append("file",image);
    formdata.append("upload_preset","insta-clone");
    formdata.append("cloud_name","di6vrum7u");
    fetch("https://api.cloudinary.com/v1_1/di6vrum7u/image/upload",{
        method:"post",
        body:formdata
    })
    .then(response=>response.json())
    .then((data)=>
    { setImage(data.url);
      console.log(data);})
    .catch((error)=>{console.log(error);});
  }
  return (
    <div className='card createpost-container'>
        <input type='text' placeholder="post title" value={title} onChange={(event)=>setTitle(event.target.value)}/>
        <input type="text" placeholder="post content" value={body} onChange={(event)=>setBody(event.target.value)}/>
        <div className="file-field input-field">
        <div className="btn waves-effect waves-light btn">
            <span>Upload Post Image</span>
            <input type="file"  onChange={(event)=>setImage(event.target.files[0])}/>
        </div>
        <div className="file-path-wrapper">
            <input className="file-path validate" type="text"/>
        </div>
    </div>
    <button onClick={()=>Submitpost()} className="waves-effect waves-light btn">Submit Post</button>

    </div>
  )
}

export default CreatePost;