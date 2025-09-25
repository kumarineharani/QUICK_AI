import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sql } from "../config/database.js"

const getUserCreations = asyncHandler( async (req, res) => {
    const { userId } = req.auth();

    let creations;
    try {

        creations = await sql` 
            SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC 
        `;

        if (!creations) {
            throw new ApiError(500, "Unable to fetch creations from database.")
        }

    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error")
    }

    return res.status(201).json(
        new ApiResponse(201, creations, "Creations fetched successfully.")
    )
})


const getPublishedCreations = asyncHandler( async (req, res) => {

    let creations;
    try {

        creations = await sql` 
            SELECT * FROM creations WHERE publish = true 
            ORDER BY created_at DESC 
        `;

        if (!creations) {
            throw new ApiError(500, "Unable to fetch creations from database.")
        }

    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error")
    }

    return res.status(201).json(
        new ApiResponse(201, creations, "Creations fetched successfully.")
    )
})

const toggleLikeCreations = asyncHandler( async (req, res) => {

    const { userId } = req.auth();
    const { creation_id } = req.body;

    let message;
    try {

        const [creations] = await sql`
            SELECT * FROM creations WHERE id = ${id}
        `;

        if (!creations) {
            throw new ApiError(500, "Creation Not Found")
        }

        const currentLikes = creation_id.likes;
        const userIdStr = userId.toString();
        
        let updatedLikes;

        if(currentLikes.includes(userIdStr)){
            updatedLikes = currentLikes.filter((user)=>user !== userIdStr)
            message = 'Creation Like Removed'
        } else {
            updatedLikes = [...currentLikes, userIdStr]
            message = 'Creation Liked'
        }

        const formattedArray = `{${updatedLikes.json(',')}}`

        await sql`
            UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${creation_id}
        `;
        

    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error")
    }

    return res.status(201).json(
        new ApiResponse(201, message)
    )
})

export { 
    getUserCreations,
    getPublishedCreations,
    toggleLikeCreations
}