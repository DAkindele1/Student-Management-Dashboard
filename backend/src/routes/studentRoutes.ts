import { Router } from 'express';
import { createStudentController, deleteStudentController, getStudentController, getStudentsController, updateStudentController } from '../controllers/studentController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);
router.get('/', getStudentsController);
router.get('/:id', getStudentController);
router.post('/', createStudentController);
router.patch('/:id', updateStudentController);
router.delete('/:id', deleteStudentController);

export default router;