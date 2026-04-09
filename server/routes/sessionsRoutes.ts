import { Router } from 'express';
import SessionsController from '../controllers/sessionsController';

const router = Router();

router.get('/', SessionsController.getAll);
router.get('/:id', SessionsController.getById);
router.post('/', SessionsController.create);
router.put('/:id', SessionsController.update);
router.delete('/:id', SessionsController.delete);

export default router;
