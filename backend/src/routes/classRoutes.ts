import { Router } from 'express';
import { createClassController, deleteClassController, getClassesController, updateClassController } from '../controllers/classController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);
router.get('/', getClassesController);
router.post('/', createClassController);
router.patch('/:id', updateClassController);
router.delete('/:id', deleteClassController);

export default router;