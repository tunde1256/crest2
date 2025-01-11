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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardModel = void 0;
const knex_1 = __importDefault(require("../db/knex"));
class CardModel {
    static createCard(card) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Default status to 'pending' if not provided
                if (!card.status) {
                    card.status = 'pending';
                }
                // If a due date is provided, ensure it's in the correct format
                if (card.due_date) {
                    card.due_date = new Date(card.due_date).toISOString().slice(0, 19).replace('T', ' ');
                }
                const [insertedCardId] = yield (0, knex_1.default)('cards').insert(card).returning('id');
                const newCard = yield (0, knex_1.default)('cards').where({ id: insertedCardId }).first();
                return newCard; // Return the newly created card
            }
            catch (error) {
                console.error('Error inserting card:', error);
                throw new Error('Failed to create card');
            }
        });
    }
    // Get all cards in a specific column
    static getCardsByColumn(column_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cards = yield (0, knex_1.default)('cards').where({ column_id }).select('*');
                return cards;
            }
            catch (error) {
                console.error('Error fetching cards by column:', error);
                throw new Error('Failed to fetch cards');
            }
        });
    }
    // Get a card by ID
    static getCardById(card_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const card = yield (0, knex_1.default)('cards').where({ id: card_id }).first();
                return card || null;
            }
            catch (error) {
                console.error('Error fetching card by ID:', error);
                throw new Error('Failed to fetch card');
            }
        });
    }
    // Update a card
    static updateCard(card_id, cardData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Update the card
                yield (0, knex_1.default)('cards').where({ id: card_id }).update(cardData);
                // Fetch and return the updated card
                const updatedCard = yield (0, knex_1.default)('cards')
                    .where({ id: card_id })
                    .first();
                return updatedCard;
            }
            catch (error) {
                console.error('Error updating card:', error);
                throw new Error('Failed to update card');
            }
        });
    }
    // Delete a card
    static deleteCard(card_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rowsDeleted = yield (0, knex_1.default)('cards').where({ id: card_id }).del();
                return rowsDeleted > 0;
            }
            catch (error) {
                console.error('Error deleting card:', error);
                throw new Error('Failed to delete card');
            }
        });
    }
}
exports.CardModel = CardModel;
