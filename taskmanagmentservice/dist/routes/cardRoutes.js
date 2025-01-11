"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cardsController_1 = require("../Controller/cardsController");
const router = (0, express_1.Router)();
// Create a card
router.post('/create', cardsController_1.CardController.createCard);
// Get all cards in a specific column
router.get('/cards/column/:column_id', cardsController_1.CardController.getCardsInColumn);
// Get a card by ID
router.get('/cards/:card_id', cardsController_1.CardController.getCardById);
// Update a card
router.put('/cards/:card_id', cardsController_1.CardController.updateCard);
// Delete a card
router.delete('/cards/:card_id', cardsController_1.CardController.deleteCard);
exports.default = router;
