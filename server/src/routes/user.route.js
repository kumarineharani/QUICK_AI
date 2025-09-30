import { Router } from 'express';

import { auth } from '../middlewares/auth.middleware.js';
import { 
    getPublishedCreations, 
    getUserCreations, 
    toggleLikeCreations 
} from '../controllers/user.controller.js';

const router = Router();

router.use(auth);

router.route('/get-user-creations').get(
    // #swagger.tags = ['user']
    getUserCreations
);

router.route('/get-published-creations').get(
    // #swagger.tags = ['user']
    getPublishedCreations
);

router.route('/toggle-like-creation').post(
    // #swagger.tags = ['user']
    toggleLikeCreations
);

export default router