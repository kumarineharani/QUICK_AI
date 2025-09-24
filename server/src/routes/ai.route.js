import { Router } from 'express';
import { 
    generateArticle, 
    generateBlogTitle, 
    generateImage 
} from '../controllers/ai.controller.js';
import { auth } from '../middlewares/auth.middleware.js';


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

export default router