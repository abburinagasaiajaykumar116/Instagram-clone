export const intialState=null;
export const reducer=(state,action)=>{
       if(action.type == "USER"){
         return action.payload;
       }
       if(action.type == "LOGOUT"){
        return null;
      }
      if(action.type == "UPDATE"){
        return{
          ...state,
          following:action.payload.following,
          followers:action.payload.followers
        }
      }
   return state;
}