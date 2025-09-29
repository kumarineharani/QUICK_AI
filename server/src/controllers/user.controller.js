import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sql } from "../config/database.js"

const getUserCreations = asyncHandler(async (req, res) => {
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


const getPublishedCreations = asyncHandler(async (req, res) => {

    let creations;
    try {

        creations = await sql` 
            SELECT * FROM creations WHERE publish = true 
            ORDER BY created_at DESC 
        `;

        if (!creations) {
            throw new ApiError(500, "Unable to fetch published creations from database.")
        }

    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error")
    }

    return res.status(201).json(
        new ApiResponse(201, creations, "Published creations fetched successfully.")
    )
})

const toggleLikeCreations = asyncHandler(async (req, res) => {

    const { userId } = req.auth();
    const { id } = req.body;

    let message;
    let updatedCreation;
    let updatedLikes;

    try {

        const [creation] = await sql`
            SELECT * FROM creations WHERE id = ${id}
        `;

        if (!creation) {
            throw new ApiError(404, "Creation Not Found")
        }

        const currentLikes = creation.likes;

        // 🟢 Convert Postgres array string → real JS array
        if (typeof currentLikes === "string") {
            currentLikes = currentLikes
                .replace(/[{}]/g, "") // remove curly braces
                .split(",")
                .filter((s) => s.trim() !== "");
        }

        const userIdStr = userId.toString();

        if (currentLikes.includes(userIdStr)) {
            updatedLikes = currentLikes.filter((user) => user !== userIdStr)
            message = 'Creation Like Removed'
        } else {
            updatedLikes = [...currentLikes, userIdStr]
            message = 'Creation Liked'
        }

        const formattedArray = `{${updatedLikes.join(',')}}`

        const result = await sql`
            UPDATE creations 
            SET likes = ${formattedArray}::text[], updated_at = NOW()
            WHERE id = ${id}
            RETURNING *;
        `;
        updatedCreation = result[0]; // extract first row

        if (!updatedCreation) {
            throw new ApiError(404, "Failed to update creation");
        }

    } catch (error) {
        console.error('Toggle like error:', error);
        throw new ApiError(500, error.message || "Internal Server Error")
    }

    return res.status(200).json(
        new ApiResponse(200, {
            id,
            isLiked: updatedLikes.includes(userId.toString()),
            likesCount: updatedLikes.length,
            likes: updatedLikes
        },
            message)
    )
})

export {
    getUserCreations,
    getPublishedCreations,
    toggleLikeCreations
}