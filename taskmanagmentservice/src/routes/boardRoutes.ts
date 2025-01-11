import express from 'express';
import {
  createBoard,
  getUserBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  addCollaborator,
  getCollaborators,
  deleteCollaborator,
} from '../Controller/boardController';

const router = express.Router();

router.post('/create', createBoard);
router.get('/get', getUserBoards);
router.get('/boards/:id', getBoardById);
router.put('/boards/:id', updateBoard);
router.delete('/boards/:id', deleteBoard);



router.post('/boards/:id/collaborators', addCollaborator);
router.get('/boards/:id/collaborators', getCollaborators);
router.delete('/boards/collaborators/:id',deleteCollaborator );

export default router;
