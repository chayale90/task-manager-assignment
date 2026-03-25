import express from 'express';
import { getTags } from '../controllers/tagController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getTags);

export default router;
