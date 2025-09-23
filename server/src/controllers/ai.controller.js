import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sql } from "../config/database.js"

import OpenAI from "openai";
import { clerkClient } from "@clerk/express";

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const generateArticle = asyncHandler(async (req, res) => {

    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!prompt || !length) {
        throw new ApiError(400, "Prompt and length are required.");
    }

    if (plan !== 'premium' && free_usage >= 10) {
        throw new ApiError(403, "Free usage limit reached. Upgrade to continue.")
    }

    let insertCreation;

    try {
        const response = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_completion_tokens: length,
        });

        const content = response.choices[0]?.message?.content;

        if (!content) {
            throw new ApiError(502, "No content received from AI provider.");
        }

        insertCreation = await sql` 
            INSERT INTO creations (user_id, prompt, content, type) 
            VALUES (${userId}, ${prompt}, ${content}, 'article') 
            RETURNING *
        `;

        if (!insertCreation) {
            throw new ApiError(500, "Unable to save article in database.")
        }

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            });
        }

    } catch (error) {
        throw new ApiError(500, error.message)
    }

    return res.status(201).json(
        new ApiResponse(201, insertCreation, "Article Generated Successfully.")
    )
})


export { generateArticle }