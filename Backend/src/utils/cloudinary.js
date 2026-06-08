import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const cc = cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// console.log(cc)

const uploadOnCloudinary = async (localFilePath) => {
    try{
        console.log("localfilepath from upload on cloudinary : " , localFilePath);
        if(!localFilePath) return null;
        // upload on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: 'auto',
        });
        // console.log('File is uploaded on cloudinary', response.url);
        fs.unlinkSync(localFilePath);
        return response;
    }
    catch(error){
        // remove the locally saved temporary file as the upload operation got failed
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export default uploadOnCloudinary;