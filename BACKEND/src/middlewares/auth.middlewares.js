//verify JWT

import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler( async (req,res,next) => {

    const accessToken = req.cookies?.accessToken || req.headers["Authorization"]?.replace("Bearer","");

    //No access token => 1. User was not logged in
    if(!accessToken)
        return res.status(421).json(new ApiError(421,"No Access token in browser"));

    try {
        const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
    
        if(!decodedToken)
            return res.status(400).json(new ApiError(400,"Something went wrong while decoding token"));
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!user)
            return res.status(422).json(new ApiError(422,"Expired Access Token but Present in Browser"));
    
        req.user = user;
        next();

    } catch (error) {
        
        if(error.name == 'TokenExpiredError')
        {
            return res.status(422).json(new ApiError(422,"Expired Access Token but Present in Browser"));
        }    

        return res.status(422).json(new ApiError(422,"Error during Verify JWT"))

    }

} );

export {verifyJWT}