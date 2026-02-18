import { Router } from 'express';
import { progressController } from '../controllers/progress.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/save', authenticateToken, progressController.saveProgress);
router.get('/', authenticateToken, progressController.getProgress);

export default router;
