import React, {  useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import StoreContext from '../../context/StoreContext'
import axios from "axios"
const LoginPopup = ({setShowLogin}) => {

    //we have to fetch url using context api
    const {url,setToken}=useContext(StoreContext);

    const [currState,setCurrState]=useState("Login")
    const [data,setData]=useState({
        name:"",
        email:"",
        password:"",

    })

    const OnChangeHandler=(event)=>{
        const name=event.target.name;
        const value=event.target.value;
        setData(data=>({...data,[name]:value}))
     }

//for user login create one function

const onLogin=async(event)=>{
event.preventDefault()
let newUrl=url;
if(currState==="Login"){
    newUrl +="/api/user/login"
}
else{
    newUrl +="/api/user/register"
}
//if the state is login it will hit login api, if post is signup it will hit register api
const response=await axios.post(newUrl,data);

if(response.data.success){
setToken(response.data.token);
//store data in local stoarge
localStorage.setItem("token",response.data.token);

//to hide login page
setShowLogin(false);

}
else{
    alert(response.data.message)
}

}
    
//whenever data got updated this function will be executed
//      useEffect(()=>{
// console.log(data);
//      },[data])
  return (
    <div className='login-popup'>
        <form onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-title">
                <h2>{currState}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
                
            </div>
            <div className="login-popup-inputs">
                {currState==="Login"?<></>:<input name='name' onChange={OnChangeHandler} value={data.name} type="text" placeholder='Your name' required />}

                
                <input name='email' onChange={OnChangeHandler} value={data.email} type='email' placeholder='Your email' required/>
                <input name='password' onChange={OnChangeHandler} value={data.password} type='password' placeholder='Your password' required/>
            </div>
            <button type='submit'>{currState==="Sign Up"?"Create account":"Login"}</button>
            <div className="login-popip-condition">
                <input type="checkbox" required/>
                <p>By continuing, I agree to the terms of use and privacy policy</p>
            </div>
            {currState==='Login'
            ?<p> Create a new account? <span onClick={()=>setCurrState("Sign Up")}   > Click here</span></p>
             : <p> Already have an account? <span onClick={()=>setCurrState ("Login")}  >Login here</span></p>}
            
           
        </form>
    </div>
  )
}

export default LoginPopup