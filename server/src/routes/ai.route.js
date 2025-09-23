import { Router } from 'express';
import { generateArticle } from '../controllers/ai.controller.js';
import { auth } from '../middlewares/auth.middleware.js';


const router = Router();

router.use(auth);

router.route('/').post(
    // #swagger.tags = ['generate-article']
    generateArticle
);

export default router