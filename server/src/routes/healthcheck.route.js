import { Router } from 'express';
import { healthcheck } from "../controllers/healthcheck.controller.js"

const router = Router();

router.route('/').get(
    // #swagger.tags = ['health']
    healthcheck
);

export default router