import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sql } from "../config/database.js"
import { uploadOnCloudinary } from "../services/cloudinary.service.js";
import axios from "axios";
import FormData from "form-data";
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

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


const generateBlogTitle = asyncHandler(async (req, res) => {

    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!prompt) {
        throw new ApiError(400, "Prompt is required.");
    }

    if (plan !== 'premium' && free_usage >= 10) {
        throw new ApiError(403, "Free usage limit reached. Upgrade to continue.")
    }

    let insertCreation;

    try {
        const response = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_completion_tokens: 100,
        });

        const content = response.choices[0]?.message?.content;

        if (!content) {
            throw new ApiError(502, "No content received from AI provider.");
        }

        insertCreation = await sql` 
            INSERT INTO creations (user_id, prompt, content, type) 
            VALUES (${userId}, ${prompt}, ${content}, 'blog-title') 
            RETURNING *
        `;

        if (!insertCreation) {
            throw new ApiError(500, "Unable to save blog title in database.")
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
        new ApiResponse(201, insertCreation, "Blog Title Generated Successfully.")
    )
})

const generateImage = asyncHandler(async (req, res) => {

    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (!prompt) {
        throw new ApiError(400, "Prompt is required.");
    }

    if (plan !== 'premium') {
        throw new ApiError(403, "This feature is only available for premium subscriber.")
    }

    let insertCreation;

    try {
        const formData = new FormData()
        formData.append('prompt', prompt)
        formData.append('style', 'realistic')
        formData.append('aspect_ratio', '3:4')
        formData.append('seed', 5)

        // const data = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
        //     headers: {
        //         'x-api-key': process.env.CLIPDROP_API_KEY,
        //     },
        //     responseType: 'arrayBuffer',
        // })

        const data = await axios.post('https://api.vyro.ai/v2/image/generations', formData, {
            headers: {
                'Authorization': process.env.IMAGINE_TOKEN,
                ...formData.getHeaders(),
            },
            responseType: 'arraybuffer',
        })

        if (!data || !data.data) {
            throw new ApiError(502, "No content received from AI provider.");
        }

        const base64Image = `data:image/png;base64,${Buffer.from(data.data).toString('base64')}`;

        if (!base64Image) {
            throw new ApiError(502, "base64Image not generated.");
        }

        const response = await uploadOnCloudinary(base64Image);

        if (!response?.url) {
            throw new ApiError(502, "Error while uploading image.")
        }

        insertCreation = await sql` 
            INSERT INTO creations (user_id, prompt, content, type, publish) 
            VALUES (${userId}, ${prompt}, ${response.url}, 'image', ${publish ?? false}) 
            RETURNING *
        `;

        if (!insertCreation) {
            throw new ApiError(500, "Unable to save image creation log in database.")
        }

    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error")
    }

    return res.status(201).json(
        new ApiResponse(201, insertCreation, "Image Generated Successfully.")
    )
})

const removeImageBackground = asyncHandler(async (req, res) => {

    const { userId } = req.auth();
    // console.log("FILES:", req.file || req.files);
    // console.log("BODY:", req.body);
    const imagePath = req.file?.path;
    // return res.json({imagePath});
    const plan = req.plan;

    if (!imagePath) {
        throw new ApiError(400, "Image is required.");
    }

    if (plan !== 'premium') {
        throw new ApiError(403, "This feature is only available for premium subscriber.")
    }

    let insertCreation;

    try {
        const response = await uploadOnCloudinary(imagePath, [{ 
            effect: 'background_removal' 
            }
        ]);

        const imageUrl = response.eager?.[0]?.secure_url || response.url;

        if (!imageUrl) {
            throw new ApiError(502, "Error while uploading image.")
        }

        insertCreation = await sql` 
            INSERT INTO creations (user_id, prompt, content, type) 
            VALUES (${userId}, 'Remove background from image', ${imageUrl}, 'image') 
            RETURNING *
        `;

        if (!insertCreation) {
            throw new ApiError(500, "Unable to save image background removal log in database.")
        }

    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error")
    }

    return res.status(201).json(
        new ApiResponse(201, insertCreation, "Image Background Removed Successfully.")
    )
})

const removeImageObject = asyncHandler(async (req, res) => {

    const { userId } = req.auth();
    const { object } = req.body;
    const imagePath = req.file?.path;
    const plan = req.plan;

    // Debug logging
    // console.log('req.body:', req.body);
    // console.log('object value:', object);
    // console.log('object type:', typeof object);
    // console.log('object length:', object?.length);

    if (!imagePath) {
        throw new ApiError(400, "Image is required.");
    }

    if(!object || object.trim().split(' ').length > 1){
         throw new ApiError(400, "Object parameter must be a single word.");
    }

    if (plan !== 'premium') {
        throw new ApiError(403, "This feature is only available for premium subscriber.")
    }

    let insertCreation;

    try {
        const response = await uploadOnCloudinary(imagePath, [
            {
                effect: `gen_remove:${object}`,
            }
        ]);

        const imageUrl = response.eager?.[0]?.secure_url || response.url;

        if (!imageUrl) {
            throw new ApiError(502, "Error while uploading image.")
        }

        insertCreation = await sql` 
            INSERT INTO creations (user_id, prompt, content, type) 
            VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image') 
            RETURNING *
        `;

        if (!insertCreation) {
            throw new ApiError(500, "Unable to save object removal log in database.")
        }

    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error")
    }

    return res.status(201).json(
        new ApiResponse(201, insertCreation, "Object Removed Successfully.")
    )
})

const resumeReview = asyncHandler(async (req, res) => {

    const { userId } = req.auth();
    const { resume } = req.files?.resume?.[0];
    const plan = req.plan;

    if (plan !== 'premium') {
        throw new ApiError(403, "This feature is only available for premium subscriber.")
    }

    if (!resume?.path) {
        throw new ApiError(400, "Resume is required.");
    }

    if(resume.size > 5 * 1024 * 1024){
        throw new ApiError(403, "Resume file size exceeds allowed size (5MB).");
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);  // getting pdf -> text

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content :\n\n${pdfData.text}`;

    let insertCreation;

    try {
        const response = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_completion_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content;

        if (!content) {
            throw new ApiError(502, "No content received from AI provider.");
        }

        insertCreation = await sql` 
            INSERT INTO creations (user_id, prompt, content, type) 
            VALUES (${userId},'Review the uploaded resume', ${content}, 'resume-review') 
            RETURNING *
        `;

        if (!insertCreation) {
            throw new ApiError(500, "Unable to save resume review log in database.")
        }

    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error")
    }

    return res.status(201).json(
        new ApiResponse(201, insertCreation, "Resume Reviewed Successfully.")
    )
})

export {
    generateArticle,
    generateBlogTitle,
    generateImage,
    removeImageBackground,
    removeImageObject,
    resumeReview
}