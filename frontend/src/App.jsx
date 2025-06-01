import React, { createContext, useContext, useState } from 'react'
import {createBrowserRouter, Route,BrowserRouter as Router, RouterProvider, Routes} from 'react-router-dom'
import HomePage from './Pages/HomePage'
import UpdateDetailsPage from './Pages/UpdateDetailsPage'
import UpdateProfileImagePage from './Pages/UpdateProfileImagePage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import NotFoundPage from './Pages/NotFoundPage'
import { useEffect } from 'react'

// const isLoggedInContext = createContext();

const App = () => {

  const [isLoggedIn,setIsLoggedIn] = useState(false);

  // const router = createBrowserRouter([
  //   {
  //     path:'/',
  //     element : <HomePage/>
  //   },
  //   {
  //     path:'/update-details',
  //     element : <UpdateDetailsPage/>
  //   },
  //   {
  //     path:'/update-profile-image',
  //     element:<UpdateProfileImagePage/>
  //   },
  //   {
  //     path:'/login',
  //     element:<LoginPage/>
  //   },
  //   {
  //     path:'/register',
  //     element:<RegisterPage/>
  //   },
  //   {
  //     path:'*',
  //     element:<NotFoundPage/>
  //   }
  // ])

  useEffect(() => {
     setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");

  },[] )
  

  return (
    // <RouterProvider router={router}/>

    
      <Router>

      <Routes>

        {
          isLoggedIn  ? 
          (
            <>
              <Route path='/' element={<HomePage/>}/>
              <Route path='/login' element={<HomePage/>}/>
              <Route path='/register' element={<HomePage/>}/>
              <Route path='/update-details' element={<UpdateDetailsPage/>}/>
              <Route path='/update-profile-image' element={<UpdateProfileImagePage/>}/>
              <Route path='*' element={<NotFoundPage/>}/>
            </>
          ) 
          : 
          (
            <>
              <Route path='/' element={<RegisterPage/>}/>
              <Route path='/login' element={<LoginPage/>}/>
              <Route path='/register' element={<RegisterPage/>}/>
              <Route path='/update-details' element={<RegisterPage/>}/>
              <Route path='/update-profile-image' element={<RegisterPage/>}/>
              <Route path='*' element={<NotFoundPage/>}/>
            </>
          )
        }

      </Routes>

    </Router>

  )
}

export default App
