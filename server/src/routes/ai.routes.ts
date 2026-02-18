import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';
import { Request, Response } from 'express';

const router = Router();

router.post('/analyze', aiController.analyze);

export default router;
