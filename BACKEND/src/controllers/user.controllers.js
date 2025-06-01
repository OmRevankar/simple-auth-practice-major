//register *
//login *
//edit details *
//edit profile Image *
//logout *
//fetch details *
//start new session *
//update access token

import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import fs from "fs"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const startNewSession = async (user_id) => {

    try {
        const user = await User.findById(user_id);
    
        const newRefreshToken = user.generateRefreshToken();
        const newAccessToken = user.generateAccessToken();
    
        user.refreshToken = newRefreshToken;
        user.save({validateBeforeSave : false});

        return {newRefreshToken,newAccessToken};

    } catch (error) {
        
        throw new ApiError(500 , "Coudnt restart new session");

    }

}

const userRegister = asyncHandler( async (req,res) => {

    //fullname
    //username
    //email
    //password
    //profileImage

    //get user details
    //verify its not null
    //verify no users exists with same username or email
    //get profile Image
    //verify not null
    //upload on cloudinary
    //create user in db

    const {fullName , username , email , password} = req.body;

    // console.log(req.body);

    if( [fullName , username , email , password].some( (value)=> !value || value.trim() === "" ) )
        return res.status(400).json( new ApiError(400 , "All the fields are required") );

    const existingUser = await User.findOne({
        $or : [{email} , {username}]
    });

    if(existingUser)
    {
        fs.unlinkSync(req.file?.path);
        return res.status(400).json( new ApiError(400 , "User with username or email already exists") )
    }

    const profileImagePath = req.file?.path;

    if(!profileImagePath)
        return res.status(400).json(new ApiError(400,"Profile Image Required"));

    
    const cloudinary = await uploadOnCloudinary(profileImagePath);

    if(!cloudinary)
        return res.status(400).json(new ApiError(400,"Failed to upload on Cloudinary"));

    const user = await User.create({
        fullName,
        username,
        email,
        password,
        profileImage : cloudinary?.url
    });

    const isUserCreated = await User.findById(user?._id).select("-pssword -refreshToken");

    if(!isUserCreated)
        return res.status(500).json(new ApiError(500,"Error in crearing User"))

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "User Registered Successfully"
        )
    )

} );

const userLogin = asyncHandler( async (req,res) => {

    //input email , username , password
    //validate
    //find existing user
    //match password
    //generate refresh and accesss tokens
    //set cookies
    //set refresh token in user

    const {email,username,password} = req.body;

    if([email,username,password].some( (value) => !value || value.trim() === '' ))
        return res.status(400).json( new ApiError(400,"All Fields are required") );

    const existingUser = await User.findOne({
        $and : [{username} , {email}]
    });

    if(!existingUser)
        return res.status(400).json(new ApiError(400,"User with entered Email and Username doesn't exist"));

    const isPasswordCorrect = existingUser.isPasswordCorrect(password);

    if(!isPasswordCorrect)
        return res.status(400).json(new ApiError(400,"Invalid Password"));

    //generate refresh and access tokens | store tokens in cookies | store refresh token in user

    const {newRefreshToken,newAccessToken} = await startNewSession(existingUser?._id);

    const user = await User.findById(existingUser?._id).select('-password -refreshToken');

    const options = {
        httpOnly : true,
        secure : true
    };

    return res
    .status(200)
    .cookie("refreshToken",newRefreshToken,options)
    .cookie("accessToken",newAccessToken,options)
    .json(
        new ApiResponse(200,user,"User logged in Successfully")
    );

} );

const updateUserDetails = asyncHandler( async (req,res) => {

    //get details form user
    //validate
    //check for existing user
    //update new user instance

    const {fullName , username , email} = req.body;

    if([fullName , username , email].some( (value) => !value || value.trim() === '' ))
        return res.status(400).json(new ApiError(400,"All fields are mandatory"));

    const isExistingUser = await User.findOne({
        $or : [{email},{username}]
    });

    if(isExistingUser)
        return res.status(400).json(new ApiError(400,"Username or Email not available"));

    const user = req?.user;

    const updatedUser = await User.findByIdAndUpdate(
        user?._id,
        {
            $set : {
                fullName,
                username,
                email
            }
        },
        {
            new : true
        }
    ).select("-password -refresToken");

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedUser,
            "User Updated Successfully"
        )
    );
} );

const updateUserProfile = asyncHandler( async (req,res) => {

    //get image
    //validate
    //upload on cloudinary get url
    //delete old image from cloudinary
    //update user
    //response

    const newProfileImage = req.file?.path;

    if(!newProfileImage)
        return res.status(400).json(new ApiError(400,"Profile Image is required"));

    const uploadResponse = await uploadOnCloudinary(newProfileImage);

    if(!uploadResponse)
        return res.status(500).json(new ApiError(500,"Cloudinary Upload failed"));

    const cloudinaryUrl = uploadResponse?.url;

    const deleteResponse = await deleteFromCloudinary(req.user?.profileImage);

    if(!deleteResponse)
        return res.status(500).json(new ApiError(500,"Cloudinary Delete failed"));

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                profileImage : cloudinaryUrl
            }
        },
        {
            new : true
        }
    ).select('-password -refreshToken');

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Profile Image updated Successfully"
        )
    );
} );

const userLogout = asyncHandler( async (req,res) => {

    //clearing cookies
    //clearing refresh tokens from user

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {refreshToken : undefined}
        },
        {
            new : true
        }
    );

    const options = {
        httpOnly : true,
        secure : true
    };

    return res
    .status(200)
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json(
        new ApiResponse(
            200,
            {},
            "User logged out successfully"
        )
    )

} );

const fetchUserDetails = asyncHandler( async (req,res) => {

    const user = await User.findById(req.user?._id).select('-password -refreshToken');

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "User Fetched Successfully"
        )
    )

} );

const refreshAccessToken = asyncHandler( async(req,res) => {

    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    
    if(!refreshToken)
        return res.status(423).json(new ApiError(423,"NO refresh Token in cookies"));

    const decodedToken = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    //Importat Babu
    if(!user)
        return res.status(424).json(new ApiError(424,"Refresh token Expired !"));

    if(!(user.refreshToken === refreshToken))
        return res.status(425).json(new ApiError(425,"Refresh token in cookie and User DB dont match"));

    const {newRefreshToken , newAccessToken} = await startNewSession(user?._id);

    const options = {
        httpOnly : true,
        secure : true
    };

    return res
    .status(200)
    .cookie("refreshToken",newRefreshToken,options)
    .cookie("accessToken",newAccessToken,options)
    .json(
        new ApiResponse(
            200,
            {},
            "Access Token updated Successfully"
        )
    )

} );

export {
    userRegister,
    userLogin,
    updateUserDetails,
    updateUserProfile,
    userLogout,
    fetchUserDetails,
    refreshAccessToken
}