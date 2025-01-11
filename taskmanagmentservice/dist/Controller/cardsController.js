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
exports.CardController = void 0;
const axios_1 = __importDefault(require("axios"));
const cardservice_1 = require("../services/cardservice");
const notificationService_1 = require("../services/notificationService");
const emailservice_1 = __importDefault(require("../services/emailservice"));
// Create a card
class CardController {
    static createCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, column_id, due_date, status = 'pending' } = req.body; // Default status to 'pending' if not provided
            const user_id = req.headers['user_id'];
            // Check if required fields are present
            if (!user_id || !column_id || !title) {
                return res.status(400).json({ error: 'User ID, Column ID, and Card title are required' });
            }
            const userId = Array.isArray(user_id) ? user_id[0] : user_id;
            try {
                // Verify user_id through User Service using Axios
                const userResponse = yield axios_1.default.get(`http://localhost:4040/api/users/${userId}`);
                if (!userResponse.data) {
                    return res.status(403).json({ error: 'User not found' });
                }
                // Prepare card data
                const cardData = { title, description, column_id, due_date, status };
                // Create the card through CardService
                const newCard = yield cardservice_1.CardService.createCard(cardData);
                // Create notification for card creation
                yield (0, notificationService_1.sendNotification)({
                    user_id: userId,
                    message: `A new card titled "${newCard.title}" has been created in your board.`,
                    timestamp: new Date(),
                });
                // Send email notification to the user
                const userEmail = userResponse.data.email;
                if (userEmail) {
                    yield (0, emailservice_1.default)({
                        to: userEmail,
                        subject: 'New Card Created',
                        text: `Your new card titled "${newCard.title}" has been created successfully.`,
                    });
                }
                // Respond with the newly created card
                res.status(201).json(newCard);
            }
            catch (error) {
                console.error('Error creating card:', error);
                res.status(500).json({ error: 'Failed to create card' });
            }
        });
    }
    // Get all cards in a column
    static getCardsInColumn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { column_id } = req.params;
            const user_id = req.headers['user_id'];
            if (!user_id || !column_id) {
                return res.status(400).json({ error: 'Column ID and User ID are required' });
            }
            const userId = Array.isArray(user_id) ? user_id[0] : user_id;
            try {
                // Verify user_id through User Service using Axios
                const userResponse = yield axios_1.default.get(`http://localhost:4040/api/users/${user_id}`);
                if (!userResponse.data) {
                    return res.status(403).json({ error: 'User not found' });
                }
                const cards = yield cardservice_1.CardService.getCardsInColumn(column_id);
                res.status(200).json(cards);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to fetch cards' });
            }
        });
    }
    // Get a card by ID
    static getCardById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { card_id } = req.params;
            const user_id = req.headers['user_id'];
            if (!user_id || !card_id) {
                return res.status(400).json({ error: 'Card ID and User ID are required' });
            }
            const userId = Array.isArray(user_id) ? user_id[0] : user_id;
            try {
                // Verify user_id through User Service using Axios
                const userResponse = yield axios_1.default.get(`http://localhost:4040/api/users/${user_id}`);
                if (!userResponse.data) {
                    return res.status(403).json({ error: 'User not found' });
                }
                const card = yield cardservice_1.CardService.getCardById(card_id);
                if (!card) {
                    return res.status(404).json({ error: 'Card not found' });
                }
                res.status(200).json(card);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to fetch card' });
            }
        });
    }
    // Update a card
    static updateCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { card_id } = req.params;
            const { title, description, column_id, due_date, status } = req.body; // Include status
            const user_id = req.headers['user_id'];
            if (!user_id || !card_id) {
                return res.status(400).json({ error: 'Card ID and User ID are required' });
            }
            const userId = Array.isArray(user_id) ? user_id[0] : user_id;
            try {
                // Verify user_id through User Service using Axios
                const userResponse = yield axios_1.default.get(`http://localhost:4040/api/users/${user_id}`);
                if (!userResponse.data) {
                    return res.status(403).json({ error: 'User not found' });
                }
                const cardData = { title, description, column_id, due_date, status }; // Include status in update
                const updatedCard = yield cardservice_1.CardService.updateCard(card_id, cardData);
                res.status(200).json(updatedCard);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to update card' });
            }
        });
    }
    // Delete a card
    static deleteCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { card_id } = req.params;
            const user_id = req.headers['user_id'];
            if (!user_id || !card_id) {
                return res.status(400).json({ error: 'Card ID and User ID are required' });
            }
            const userId = Array.isArray(user_id) ? user_id[0] : user_id;
            try {
                // Verify user_id through User Service using Axios
                const userResponse = yield axios_1.default.get(`http://localhost:4040/api/users/${user_id}`);
                if (!userResponse.data) {
                    return res.status(403).json({ error: 'User not found' });
                }
                const success = yield cardservice_1.CardService.deleteCard(card_id);
                if (!success) {
                    return res.status(404).json({ error: 'Card not found or could not be deleted' });
                }
                res.status(200).json({ message: 'Card deleted successfully' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to delete card' });
            }
        });
    }
}
exports.CardController = CardController;
