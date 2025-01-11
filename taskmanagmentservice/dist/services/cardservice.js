"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardService = void 0;
const cardmodel_1 = require("../Model/cardmodel"); // Assuming CardModel handles DB queries
class CardService {
    // Create a new card
    static createCard(card) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create card in the database
                const newCard = yield cardmodel_1.CardModel.createCard(card); // Assuming createCard returns the created card
                if (!newCard) {
                    throw new Error('Failed to create the card');
                }
                return newCard;
            }
            catch (error) {
                console.error('Error in createCard:', error);
                throw new Error('Service: Failed to create card');
            }
        });
    }
    // Get all cards in a specific column
    static getCardsInColumn(column_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch cards in the specified column from DB
                const cards = yield cardmodel_1.CardModel.getCardsByColumn(column_id); // Assuming this method returns an array of cards
                if (!cards) {
                    throw new Error('No cards found in this column');
                }
                return cards;
            }
            catch (error) {
                console.error('Error in getCardsInColumn:', error);
                throw new Error('Service: Failed to fetch cards');
            }
        });
    }
    // Get a card by ID
    static getCardById(card_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch a single card by ID from DB
                const card = yield cardmodel_1.CardModel.getCardById(card_id); // Assuming this method returns a card or null
                if (!card) {
                    throw new Error('Card not found');
                }
                return card;
            }
            catch (error) {
                console.error('Error in getCardById:', error);
                throw new Error('Service: Failed to fetch card');
            }
        });
    }
    // Update a card
    static updateCard(card_id, cardData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Update the card in the database
                const updatedCard = yield cardmodel_1.CardModel.updateCard(card_id, cardData); // Assuming this method returns the updated card
                if (!updatedCard) {
                    throw new Error('Card update failed');
                }
                return updatedCard;
            }
            catch (error) {
                console.error('Error in updateCard:', error);
                throw new Error('Service: Failed to update card');
            }
        });
    }
    // Delete a card
    static deleteCard(card_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delete the card from the database
                const success = yield cardmodel_1.CardModel.deleteCard(card_id); // Assuming this returns a boolean indicating success
                if (!success) {
                    throw new Error('Failed to delete the card');
                }
                return success;
            }
            catch (error) {
                console.error('Error in deleteCard:', error);
                throw new Error('Service: Failed to delete card');
            }
        });
    }
}
exports.CardService = CardService;
