import React, { useContext, useEffect, useState } from 'react'
import { BACKEND_URL } from '../helper/constants'
import toast, { Toaster } from 'react-hot-toast'
import ButtonComponent from '../components/ButtonComponent'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {

  const navigate = useNavigate();

  // const {isLoggedIn,setIsLoggedIn} = useContext(isLoggedInCon);

  const [username,setUsername] = useState(null);
  const [fullName,setFullName] = useState(null);
  const [email,setEmail] = useState(null);
  const [profileImageUrl,setProfileImageUrl] = useState(null);

  const refreshAccessToken = async () => {

    try {
      
      const response = await fetch(`${BACKEND_URL}/users/refresh-access-token`,{
      method:"POST",
      credentials:"include"
    });

    const resp = await response.json();

    if(resp.statusCode == 200) // Active refresh token => + We refreshed the Access Token as well
      {
        toast.success(resp.message);
        console.log(resp.message);
        localStorage.setItem("isLoggedIn",true);
        window.location.href = './'
        // fetchUser();
      }
      else
      {
        console.log(resp.message);
        localStorage.setItem("isLoggedIn",false);
        window.location.href = './register'
      }

    } catch (error) {
      console.log(error);
      toast.error(error);
      localStorage.setItem("isLoggedIn",false);
      window.location.href = './register'
    }

    // return fetch(`${BACKEND_URL}/users/refresh-access-token`,{
    //   method:"POST",
    //   credentials:"include"
    // })
    // .then((response)=>response.json())
    // .then((resp) => {

    //   if(resp.statusCode == 200) // Active refresh token => + We refreshed the Access Token as well
    //   {
    //     toast.success(resp.message);
    //     console.log(resp.message);
    //     localStorage.setItem("isLoggedIn",true);
    //   }
    //   else if(resp.statusCode == 423) //refresh token absent in browser
    //   {
    //     console.log(resp.message);
    //     localStorage.setItem("isLoggedIn",false);
    //   }
    //   else if(resp.statusCode == 424) //refresh token present but expired
    //   {
    //     console.log(resp.message);
    //     localStorage.setItem("isLoggedIn",false);
    //   }
    //   else
    //   {
    //     console.log(resp.message);
    //     localStorage.setItem("isLoggedIn",false);
    //   } 

    // })
    // .catch((error) => {
    //   console.log(error);
    //   toast.error(error);
    // })

  }

  const fetchUser = async () => {

    try {
      
      const response = await fetch(`${BACKEND_URL}/users/fetch-user`,{
      method : "GET",
      credentials : "include"
      });

      const resp = await response.json();

      if(resp.statusCode == 200)
        {
          toast.success(resp.message);
          setFullName(resp.data.fullName);
          setUsername(resp.data.username);
          setEmail(resp.data.email);
          setProfileImageUrl(resp.data.profileImage);
          localStorage.setItem("isLoggedIn",true);
        }
        else if(resp.statusCode == 421) // No access token in Browser => User already logged out
        {
          //just for formality
          localStorage.setItem("isLoggedIn",false);
          window.location.href = './register'
          console.log(resp.message);
        }
        else if(resp.statusCode == 422) //Expired Access Token but Present in Browser => Look for refresh Token
        {
          //execute refresh-access-token controller
          console.log(resp.message);
          await refreshAccessToken();
        }   
        else
        {  
          toast.error(resp.message || "Failed to fetch User");
          console.log("Failed to fetch User");
          localStorage.setItem("isLoggedIn",false);
          window.location.href = './register'
          
        }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

    // return fetch(`${BACKEND_URL}/users/fetch-user`,{
    //   method : "GET",
    //   credentials : "include"
    // })
    // .then((response) => response.json())
    // .then((resp) => {

    //     // console.log(resp);

    //     if(resp.statusCode == 200)
    //     {
    //       toast.success(resp.message);
    //       setFullName(resp.data.fullName);
    //       setUsername(resp.data.username);
    //       setEmail(resp.data.email);
    //       setProfileImageUrl(resp.data.profileImage);
    //       localStorage.setItem("isLoggedIn",true);
    //     }
    //     else if(resp.statusCode == 421) // No access token in Browser => User already logged out
    //     {
    //       //just for formality
    //       localStorage.setItem("isLoggedIn",false);
    //     }
    //     else if(resp.statusCode == 422) //Expired Access Token but Present in Browser => Look for refresh Token
    //     {
    //       //execute refresh-access-token controller
    //       console.log(resp.message);
    //       refreshAccessToken();
    //     }   
    //     else
    //     {  
    //       toast.error(resp.message || "Failed to fetch User")
          
    //     }

    // })
    // .catch((error) => {
    //   console.log(error);
    //   toast.error(error)
    // })

  }

  const navigateUpdateDetails = () => {
    navigate('/update-details');
  }

  const navigateUpdateProfileImage = () => {
    navigate('/update-profile-image');
  }

  const logout = async () => {

    return fetch(`${BACKEND_URL}/users/logout`,{
      method : "POST",
      credentials : "include"
    })
    .then((response) => response.json())
    .then((resp) => {

      if(resp.statusCode == 200)
      {
        toast.success(resp.message);
        localStorage.setItem("isLoggedIn",false);
        window.location.href = './register'
      }
      else
      {
        toast.error(resp.message || "Couldn't logout User");
      }

    })
    .catch((error) => {
      toast.error(error);
    })


  }

  useEffect(() => {
    fetchUser();
  }, [])
  

  return (
    <div className='m-2 flex flex-col gap-6'>
      <div className='flex flex-row gap-5 border-2 shadow-2xl w-2/3'>

      <div>
        <img src={profileImageUrl} className='w-[100px] h-[100px]' alt="" />
      </div>

      <div>
        <div>FullName : {fullName}</div>
        <div>Username : {username}</div>
        <div>Email : {email}</div>
      </div>

      </div>
      <Toaster/>

      <div className='flex flex-row gap-3'> 
        <ButtonComponent name='Update Detail' handleClick={navigateUpdateDetails}></ButtonComponent>

        <ButtonComponent name='Update Profile Image' handleClick={navigateUpdateProfileImage}></ButtonComponent>
        
        <ButtonComponent name='Logout' handleClick={logout}></ButtonComponent>
      </div>
    </div>
  )
}

export default HomePage
