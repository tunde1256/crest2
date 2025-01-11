import { Router } from 'express';
import { ListController } from '../Controller/listController';

const router = Router();

router.post('/lists', ListController.createList);
router.get('/boards/:board_id/lists', ListController.getListsByBoard);
router.get('/lists/:list_id', ListController.getListById);
router.put('/lists/:list_id', ListController.updateList);
router.delete('/lists/:list_id', ListController.deleteList);

export default router;
