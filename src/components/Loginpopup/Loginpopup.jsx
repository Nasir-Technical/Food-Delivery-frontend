import React, { useContext, useState } from 'react'
import './Loginpopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import  axios from "axios"

const Loginpopup = ({setShowLogin}) => {

  const {url,setToken} = useContext(StoreContext)
    const [currstate,setCurrState] = useState("Login")

    const [data,setData] = useState({
      name:"",
      email:"",
      password:""
    })

    const onchangeHandler = (event) => {
       const name = event.target.name;
       const value = event.target.value;
       setData(data=>({...data,[name]:value}))
    }

    const onLogin = async (event) =>{
         event.preventDefault()
         let newUrl = url;
         if (currstate==="Login") {
          newUrl += "/api/user/login"
         }
         else {
          newUrl += "/api/user/register"
         }
         const response = await axios.post(newUrl,data);

         if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem("token",response.data.token);
          setShowLogin(false)
         }
         else {
          alert(response.data.message)
         }
    }

  return (
    <div className='login-popup'>
         <form onSubmit={onLogin} className='login-popup-container'>
            <div className="login-popup-title">
                <h2>{currstate}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-inputs">
                {currstate==="Login"?<></>:<input name='name' onChange={onchangeHandler} value={data.name} type="text" placeholder='your name' required />}
                <input name='email' onChange={onchangeHandler} value={data.email} type="email" placeholder='your email' required />
                <input name='password' onChange={onchangeHandler} value={data.password} type="password" placeholder='password' required />
            </div>
            <button type='submit'>{currstate==="Sign up"?"create account":"Login"}</button>
            <div className="login-popup-condition">
                <input type="checkbox" required/>
                <p>By continuing, i agree to the terms of use & privacy policy.</p>
            </div>
            {currstate==="Login"
            ?<p>Create a new account?    <span onClick={()=>setCurrState("Sign up")}>Click here</span></p>
            :<p>already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>
            }
         </form>
    </div>
  )
}

export default Loginpopup