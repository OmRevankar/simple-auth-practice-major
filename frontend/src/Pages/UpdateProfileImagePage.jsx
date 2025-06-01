import React from 'react'
import { useForm } from 'react-hook-form'
import { BACKEND_URL } from '../helper/constants'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const UpdateProfileImagePage = () => {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors , isSubmitting},
  } = useForm()

  const onSubmit = async (data) => {

    const formData = new FormData();
    formData.append("profileImage",data.profileImage[0]);

    return fetch(`${BACKEND_URL}/users/update-profile`,{
      method : "PATCH",
      body:formData,
      credentials:"include"
    })
    .then((response) => response.json())
    .then((resp) => {

      if(resp.statusCode == 200)
      {
        toast.success(resp.message);
        navigate('/');
      }
      else
      {
        toast.error(resp.message || "Can't Update User Profile Image")
      }

    })
    .catch((error) => {
      console.log(error);
      toast.error(error);
    })

  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div>
          <label htmlFor="">Add Profile Image</label>
          <br />
          <input type="file" accept='image/*' {...register('profileImage',{
          required : {value : true , message:"Profile Image Required"}
          })}/>
          <br />
          {errors.profileImage && <p className='border-2 bg-red-400 text-black'>{errors.profileImage.message}</p>}

        </div>

        <br /><br />

        <input type="submit" value={isSubmitting?"Submitting":"Submit"} disabled={isSubmitting} />

      </form>
    </div>
  )
}

export default UpdateProfileImagePage
