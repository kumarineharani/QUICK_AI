import { v2 as cloudinary } from 'cloudinary';
import { log } from 'console';
import fs from "fs";
import { ApiError } from '../utils/ApiError.js';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async function (localFilePath) {
    
    try {

        if(!localFilePath)  return null

        const response = await cloudinary.uploader
        .upload(
            localFilePath, {
                resource_type: "auto",
            }
        )
        // console.log(`File Uploaded Successfully : ${response.url}`)
        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {        
        fs.unlinkSync(localFilePath)
        return error.msg;
    } finally {                 // Ensures the local files are deleted in upload error situations
        if (localFilePath && fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
            } catch (err) {
                console.error("Failed to delete temp file:", localFilePath, err.message);
            }
        }
    }

}

const extractPublicIdFromUrl = function (url) {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    const pathAndFile = parts[1]; // e.g. v1683480000/myfolder/image_x123.jpg
    const withoutVersion = pathAndFile.replace(/^v\d+\//, ""); // remove v1234/

    const publicId = withoutVersion.replace(/\.[^/.]+$/, ""); // remove extension
    return publicId; // e.g. myfolder/image_x123
}


const deleteImageFromCloudinary = async function (publicURL) {
    try {
        let publicId = extractPublicIdFromUrl(publicURL);
        console.log(publicId);
        if (!publicId) {
            throw new Error("public_id is required for deletion.");
        }

        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
        });
        
        return response;
    } catch (error) {
        console.log(error.msg);
        throw error.msg;
    }
};

export { 
    uploadOnCloudinary,
    deleteImageFromCloudinary
 }
    
    
    
    