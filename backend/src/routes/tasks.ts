import express from 'express';
import { getTasks, createTask, updateTask, deleteTask, getTaskById, getTaskActivity } from '../controllers/taskController';
import { suggestTaskDetails } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/suggest', authenticate, suggestTaskDetails);
router.get('/', authenticate, getTasks);
router.get('/:id', authenticate, getTaskById);
router.get('/:id/activity', authenticate, getTaskActivity);
router.post('/', authenticate, createTask);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);

export default router;

