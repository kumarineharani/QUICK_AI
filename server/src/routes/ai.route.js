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
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.use(auth);

router.route('/generate-article').post(
    // #swagger.tags = ['generate-article']
    generateArticle
);

router.route('/generate-blog-title').post(
    // #swagger.tags = ['generate-blog-title']
    generateBlogTitle
);

router.route('/generate-image').post(
    // #swagger.tags = ['generate-image']
    generateImage
);

router.route('/remove-image-background').post(
    // #swagger.tags = ['remove-image-background']
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    removeImageBackground
);

router.route('/remove-image-object').post(
    // #swagger.tags = ['remove-image-object']
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    removeImageObject
);

router.route('/resume-review').post(
    // #swagger.tags = ['resume-review']
    upload.fields([
        {
            name: "resume",
            maxCount: 1
        }
    ]),
    resumeReview
);


export default router