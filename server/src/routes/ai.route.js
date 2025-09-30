import { Router } from 'express';
import { 
    generateArticle, 
    generateBlogTitle, 
    generateImage, 
    removeImageBackground,
    removeImageObject,
    resumeReview
} from '../controllers/ai.controller.js';
import { auth } from '../middlewares/auth.middleware.js';
import { upload } from "../middlewares/multer.middlesware.js";


const router = Router();

router.use(auth);

router.route('/generate-article').post(
    // #swagger.tags = ['ai']
    generateArticle
);

router.route('/generate-blog-title').post(
    // #swagger.tags = ['ai']
    generateBlogTitle
);

router.route('/generate-image').post(
    // #swagger.tags = ['ai']
    generateImage
);

router.route('/remove-image-background').post(
    // #swagger.tags = ['ai']
    upload.single("image"),
    removeImageBackground
);

router.route('/remove-image-object').post(
    // #swagger.tags = ['ai']
    upload.single("image"),
    removeImageObject
);

router.route('/resume-review').post(
    // #swagger.tags = ['ai']
    upload.fields([
        {
            name: "resume",
            maxCount: 1
        }
    ]),
    resumeReview
);


export default router