import React from 'react'
import { useForm } from 'react-hook-form';
import { BACKEND_URL } from '../helper/constants';
import toast , { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors , isSubmitting},
    } = useForm();

    const onSubmit = async (data) => {
        
        const formData = new FormData();
        formData.append("fullName" , data.fullName);
        formData.append('username',data.username);
        formData.append('email',data.email);
        formData.append('password',data.password);
        formData.append('profileImage',data.profileImage[0]);

        return fetch(`${BACKEND_URL}/users/register`,{
            method : "POST",
            body : formData
        })
        .then( (response) => response.json() )
        .then( (resp) => {

            console.log(resp)

            if(resp.statusCode == 200)
            {
                //success
                console.log("Successfull Registration");
                toast.success(resp.message);
                window.location.href = './login'
            }
            else
            {
                //failure
                console.log("Registration Failed");
                toast.error(resp.message ||"Failed to register");
            }

        } )
        .catch( (error) => {
            console.log(error);
            toast.error(error);
        } )
    }

    const navigateToLogin = () => {
        window.location.href = './login'
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>

            <div>
                <label htmlFor="">Profile Picture</label>
                <br />
                <input type="file" accept='image/*' {...register('profileImage',{
                    required : {value:true,message:"Profile Image Required"}
                })}/>
                <br />
                {errors.profileImage && <p className='border-2 bg-red-400 text-black'>{errors.profileImage.message}</p> }
            </div>

            <br />    

            <div>
                <label htmlFor="">Full Name</label>
                <br />
                <input type="text" placeholder='Enter Full Name' {...register('fullName',{
                    required : {value:true , message:"Full Name is required"},
                    minLength : {value:2 , message:"Minimun length must be 2"},
                    maxLength : {value:15 , message:"FullName should not exceed 15 letters"}
                })}/>
                <br />
                {errors.fullName && <p className='border-2 bg-red-400 text-black' >{errors.fullName.message}</p> }
            </div>

            <br />

            <div>
                <label htmlFor="">Username</label>
                <br />
                <input type="text" placeholder='Enter Username' {...register('username',{
                    pattern : {value:/^[a-zA-Z0-9._]{2,15}$/ , message:"Username not as per Rules"}
                })}/>
                <br />
                {errors.username && <p className='border-2 bg-red-400 text-black' >{errors.username.message}</p> }
            </div>

            <br />

            <div>
                <label htmlFor="">Email</label>
                <br />
                <input type="text" placeholder='Enter Email' {...register('email',{
                    pattern : {value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , message:"Invalid Email"}
                })}/>
                <br />
                {errors.email && <p className='border-2 bg-red-400 text-black' >{errors.email.message}</p> }
            </div>

            <br />

            <div>
                <label htmlFor="">Password</label>
                <br />
                <input type="text" placeholder='Enter Password' {...register('password',{
                    pattern : {value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/ , message:"Password is not Strong enough"}
                })}/>
                <br />
                {errors.password && <p className='border-2 bg-red-400 text-black' >{errors.password.message}</p> }
            </div>

            <br />

            <input type="submit" value={isSubmitting ? "Submitting" : "Submit"} disabled={isSubmitting}/>    

            </form>

            <div>
                Already have an account ? <button onClick={navigateToLogin} className='text-blue-600 font-semibold'>Login Now</button>
            </div>

            <Toaster/>
        </div>
    )
}

export default RegisterPage
