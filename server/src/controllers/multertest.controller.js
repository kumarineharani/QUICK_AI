import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Multer test controller
const multerCheck = asyncHandler(async (req, res) => {
  console.log("Files:", req.file || req.files);
  console.log("Body:", req.body);

  if (!req.file && (!req.files || Object.keys(req.files).length === 0)) {
    throw new ApiError(400, "No file uploaded");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        message: "File uploaded successfully",
        files: req.file || req.files,
        body: req.body
      }
    )
  );
});

export {
  multerCheck
};
