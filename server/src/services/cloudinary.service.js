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

/**
 * Upload file to Cloudinary
 * @param {string} fileInput - local file path OR base64 string
 * @returns {Promise<object|null>} - Cloudinary response or null
 */

const uploadOnCloudinary = async function (fileInput) {

    try {

        if (!fileInput) return null

        const response = await cloudinary.uploader
            .upload(
                fileInput, {
                resource_type: "auto",
            }
            )
        // console.log(`File Uploaded Successfully : ${response.url}`)

        // If it was a local file path → cleanup
        if (fs.existsSync(fileInput)) {
            try {
                fs.unlinkSync(fileInput);
            } catch (err) {
                console.error("Failed to delete temp file:", fileInput, err.message);
            }
        }
        return response

    } catch (error) {
        throw new ApiError(500, error.message || "Cloudinary upload failed");
    } finally {                 // Ensures the local files are deleted in upload error situations
        if (fileInput && fs.existsSync(fileInput)) {
            try {
                fs.unlinkSync(fileInput);
            } catch (err) {
                console.error("Failed to delete temp file:", fileInput, err.message);
            }
        }
    }

}

/**
 * Extract public_id from a Cloudinary URL
 * @param {string} url
 * @returns {string|null}
 */

const extractPublicIdFromUrl = function (url) {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    const pathAndFile = parts[1]; // e.g. v1683480000/myfolder/image_x123.jpg
    const withoutVersion = pathAndFile.replace(/^v\d+\//, ""); // remove v1234/

    const publicId = withoutVersion.replace(/\.[^/.]+$/, ""); // remove extension
    return publicId; // e.g. myfolder/image_x123
}

/**
 * Delete image from Cloudinary
 * @param {string} publicURL
 * @returns {Promise<object>}
 */

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
        throw new ApiError(500, error.message || "Cloudinary deletion failed");
    }
};

export {
    uploadOnCloudinary,
    deleteImageFromCloudinary
}



