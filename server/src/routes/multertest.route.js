import { Router } from "express";
import { multerCheck } from "../controllers/multertest.controller.js";
import { upload } from "../middlewares/multer.middlesware.js";
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(auth);

// Single file upload under field name "image"
router.route("/").post(
  // #swagger.tags = ['multer-check']
  upload.single("image"),
  multerCheck
);

// If you want multiple files, you could also use:
// router.route("/multer-check").post(upload.array("image", 5), multerCheck);

export default router;
