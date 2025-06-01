import React from 'react'
import { Form, useForm } from 'react-hook-form'
import { BACKEND_URL } from '../helper/constants';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

    //handleSubmit , watch , formstate(errors , isSubmitting) , register

    const navigate = useNavigate(); 

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors , isSubmitting},
    } = useForm();

    const onSubmit = async (data) => {
        
        // const formData = new FormData();
        // formData.append('username',data.username);
        // formData.append('email',data.email);
        // formData.append('password',data.password);

        const formDataInJson = JSON.stringify({
            "username" : data.username,
            "email" : data.email,
            "password" : data.password
        });

        return fetch(`${BACKEND_URL}/users/login`,{
            method : "POST",
            credentials:"include",
            headers: {
                "Content-Type": "application/json",  // Important!
            },
            body : formDataInJson
        })
        .then((response) => response.json())
        .then( (resp) => {
            // console.log(resp);

            if(resp.statusCode == 200)
            {    
                console.log(resp.message)
                toast.success("User Logged in Successfully");
                localStorage.setItem("isLoggedIn",true);
                
                window.location.href = './'
            }
            else
                toast.error(resp.message || "Failed to Login")
        } )
        .catch((error) => {
            console.log("Error")
            console.log(error);
        })
    }

    const navigateToRegister = () => {
        window.location.href = './register'
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>

            <div>
                <label htmlFor="">Username</label>
                <br />
                <input type="text" placeholder='Enter Username' {...register('username',{
                    pattern : {value : /^[a-zA-Z0-9._]{2,15}$/ , message:"Username Invalid"}
                })} />

                {errors.username && <p className='border-2 bg-red-400 text-black'>{errors.username.message}</p>}
            </div>

            <br />

            <div>
                <label htmlFor="">Email</label>
                <br />
                <input type="text" placeholder='Enter Email' {...register('email',{
                    pattern : {value : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , message:"Email Invalid"}
                })} />

                {errors.email && <p className='border-2 bg-red-400 text-black'>{errors.email.message}</p>}
            </div>

            <br />    

            <div>
                <label htmlFor="">Password</label>
                <br />
                <input type="text" placeholder='Enter Password' {...register('password',{
                    pattern : {value : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/ , message:"Password Invalid"}
                })} />

                {errors.password && <p className='border-2 bg-red-400 text-black'>{errors.password.message}</p>}
            </div>

            <br />

            <input type="submit" value={isSubmitting ? "Submitting" : "Submit"} disabled={isSubmitting} />

            </form>
            <Toaster/>

            <p>Don't have an account <button onClick={navigateToRegister} className='text-blue-600 font-semibold'>Register Now</button> </p>
        </div>
    )
}

export default LoginPage
