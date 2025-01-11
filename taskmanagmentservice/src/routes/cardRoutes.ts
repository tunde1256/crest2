import { Router } from 'express';
import { CardController } from '../Controller/cardsController';

const router = Router();

router.post('/create', CardController.createCard);
router.get('/cards/column/:column_id', CardController.getCardsInColumn);
router.get('/cards/:card_id', CardController.getCardById);
router.put('/cards/:card_id', CardController.updateCard);
router.delete('/cards/:card_id', CardController.deleteCard);

export default router;
