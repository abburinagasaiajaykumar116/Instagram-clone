import React,{useContext} from 'react';
import './Navbar.css';
import { Link,useNavigate } from 'react-router-dom';
import {UserContext} from '../App';
function Navbar() {
  const history=useNavigate();
  const {state,dispatch}=useContext(UserContext);
  const logout=()=>{
   localStorage.clear();
   dispatch({type:"LOGOUT"});
   history('/login');


  }
  const navList=()=>{
    if(state){
      return[
        <li key="334647"><Link to="/create-post">CreatePost</Link></li>,
        <li key="456834"><Link to="/profile">Profile</Link></li>,
        <li key="490739"><Link to="/postsfromfollowing">Posts from followings</Link></li>,
        <li key="374568">
          <button onClick={()=>logout()} className="waves-effect waves-light btn #c62828 red darken-3">Logout</button>
        </li>

      ]
    }else{
        return[
          <li key="358506"><Link to="/login">Login</Link></li>,
        <li key="209847"><Link to="/signup">Signup</Link></li>

        ]
    }
  }
  return (
    <nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"/login"} className="brand-logo"><span>Instagram</span></Link>
      <ul id="nav-mobile" className="right">
        {navList()}
      </ul>
    </div>
  </nav>

  );
}

export default Navbar;