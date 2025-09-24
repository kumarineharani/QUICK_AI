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
    // #swagger.tags = ['get-user-creations']
    getUserCreations
);

router.route('/get-published-creations').get(
    // #swagger.tags = ['get-published-creations']
    getPublishedCreations
);

router.route('/toggle-like-creation').post(
    // #swagger.tags = ['toggle-like-creation']
    toggleLikeCreations
);

export default router