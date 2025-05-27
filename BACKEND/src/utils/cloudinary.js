import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,     
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {

    try {
        const uploadResponse = await cloudinary.uploader.upload(localFilePath);
    
        if(!uploadResponse)
        {
            console.log("Cloudinary Upload Failed");
        }
    
        fs.unlinkSync(localFilePath);
        console.log("Cloudinary Upload Successfull");

        return uploadResponse;

    } catch (error) {
        
        fs.unlinkSync(localFilePath);
        console.log("Error during cloudinary upload");
        return null;

    }

}

const deleteFromCloudinary = async (cloudinaryFilePath) => {

    try {
        
        const publicId = cloudinaryFilePath.split('/').pop().split('.')[0];
        const deleteResponse = await cloudinary.uploader.destroy(publicId);

        if(!deleteResponse)
            console.log("Cloudinary Delete failed");

        console.log("Successfull cloudinary deletion");
        return deleteResponse;

    } catch (error) {
        console.log("Error while deleting cloudinary file");
        return null;
    }

}

export {uploadOnCloudinary,deleteFromCloudinary};

// import { v2 as cloudinary } from 'cloudinary';

// (async function() {

//     // Configuration
//     cloudinary.config({ 
//         cloud_name: 'omcloudinary', 
//         api_key: '575352791976549', 
//         api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
//     });
    
//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();