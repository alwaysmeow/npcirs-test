import { Router } from 'express';
import MoviesController from '../controllers/moviesController';

const router = Router();

router.get('/count', MoviesController.getCount);
router.get('/', MoviesController.getAll);
router.get('/:id', MoviesController.getById);
router.post('/', MoviesController.create);
router.put('/:id', MoviesController.update);
router.delete('/:id', MoviesController.delete);

export default router;
