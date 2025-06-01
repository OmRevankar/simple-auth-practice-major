import React from 'react'
import { useForm } from 'react-hook-form'
import { BACKEND_URL } from '../helper/constants';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UpdateDetailsPage = () => {

  const navigate = useNavigate();

  const {
          register,
          handleSubmit,
          watch,
          formState: { errors , isSubmitting},
      } = useForm();

  const onSubmit = async (data) => {

    const formDataInJson = JSON.stringify({
      fullName:data.fullName,
      username:data.username,
      email:data.email
    })

    return fetch(`${BACKEND_URL}/users/update-details`,{
      method:"PATCH",
      body:formDataInJson,
      credentials:"include",
      headers : {
        "Content-Type" : "application/json"
      }
    })
    .then((response)=>response.json())
    .then((resp)=>{

      if(resp.statusCode == 200)
      {
        toast.success(resp.message);
        navigate('/');
      }
      else
      {
        toast.error(resp.message || "Cannot update User");
      }
    })
    .catch((error)=>{
      console.log(error);
      toast.error(error);
    })

  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>

            <div>
                <label htmlFor="">Full Name</label>
                <br />
                <input type="text" placeholder='Enter FullName' {...register('fullName',{
                    required : {value:true , message:"Full Name is required"},
                    minLength : {value:2 , message:"Minimun length must be 2"},
                    maxLength : {value:15 , message:"FullName should not exceed 15 letters"}
                })} />

                {errors.fullName && <p className='border-2 bg-red-400 text-black'>{errors.fullName.message}</p>}
            </div>

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

            <input type="submit" value={isSubmitting ? "Submitting" : "Submit"} disabled={isSubmitting} />

            </form>
            <Toaster/>
    </div>
  )
}

export default UpdateDetailsPage
