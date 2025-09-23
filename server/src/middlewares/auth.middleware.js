import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clerkClient } from "@clerk/express";

// Middleware to check userId and hasPremiumPlan
export const auth = asyncHandler(async (req, res, next) => {
    try {
        const { userId, has } = await req.auth();
        if (!userId) {
            throw new ApiError(401, "Authentication required");
        }
        const hasPremiumPlan = await has({ plan: 'premium' });

        const user = await clerkClient.users.getUser(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        if (!hasPremiumPlan && user.privateMetadata.free_usage) {
            req.free_usage = user.privateMetadata.free_usage;
        }
        else {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            });
            req.free_usage = 0;
        }

        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Authentication failed");
    }
});