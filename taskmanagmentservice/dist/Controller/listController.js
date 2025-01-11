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
exports.ListController = void 0;
const Listservice_1 = require("../services/Listservice"); // Corrected import of ListService
const axios_1 = __importDefault(require("axios"));
const knex_1 = __importDefault(require("../db/knex")); // Corrected import for knex
const knex_2 = __importDefault(require("../db/knex"));
const userServiceUrl = 'http://localhost:4040/api/users/'; // URL for the user service
class ListController {
    // Create a list in a board
    static createList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, board_id } = req.body;
            const user_id = req.headers['user_id']; // Get user_id from headers
            // Validate that user_id, board_id, and name are provided
            if (!user_id || !board_id || !name) {
                return res.status(400).json({ error: 'User ID, Board ID, and List name are required' });
            }
            try {
                // 1. Fetch the user details from the user service using the user_id
                const userResponse = yield axios_1.default.get(`${userServiceUrl}${user_id}`);
                // 2. Check if the user exists in the user service
                if (!userResponse.data || !userResponse.data.id) {
                    return res.status(404).json({ error: 'User not found in User Service' });
                }
                // 3. Check if the board exists in the database
                const boardExists = yield (0, knex_2.default)('boards').where({ id: board_id }).first();
                if (!boardExists) {
                    return res.status(404).json({ error: 'Board not found in the database' });
                }
                // 4. Create the list if the user and board are valid
                const listData = { name, description, board_id, user_id };
                // 5. Insert the new list into the database
                const newList = yield Listservice_1.ListService.createList(listData);
                // 6. Return the newly created list in the response
                res.status(201).json(newList);
            }
            catch (error) {
                // Error handling
                if (error.response) {
                    // Handle error response from user service
                    console.error(`User service error: ${error.response.status} - ${error.response.data}`);
                    res.status(500).json({ error: 'Error communicating with the User Service' });
                }
                else if (error instanceof Error) {
                    // Handle other types of errors
                    console.error(error.message);
                    res.status(500).json({ error: 'Failed to create list' });
                }
                else {
                    console.error('Unknown error occurred');
                    res.status(500).json({ error: 'An unknown error occurred' });
                }
            }
        });
    }
    // Get all lists in a specific board
    static getListsInBoard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { board_id } = req.params;
            const user_id = req.headers['user_id'];
            if (!user_id || !board_id) {
                return res.status(400).json({ error: 'Board ID and User ID are required' });
            }
            try {
                // Fetch the lists for the given board and user
                const lists = yield Listservice_1.ListService.getListsInBoard({ board_id, user_id }); // Pass as single object
                res.status(200).json(lists);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to fetch lists' });
            }
        });
    }
    // Get a list by ID
    static getListById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { list_id } = req.params;
            const user_id = req.headers['user_id'];
            if (!user_id || !list_id) {
                return res.status(400).json({ error: 'List ID and User ID are required' });
            }
            try {
                const list = yield Listservice_1.ListService.getListById({ list_id, user_id }); // Pass as single object
                if (!list) {
                    return res.status(404).json({ error: 'List not found' });
                }
                res.status(200).json(list);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to fetch list' });
            }
        });
    }
    // Update a list
    static updateList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { list_id } = req.params;
            const { name, description } = req.body;
            const user_id = req.headers['user_id'];
            if (!user_id || !list_id) {
                return res.status(400).json({ error: 'List ID and User ID are required' });
            }
            try {
                const listData = { name, description };
                const updatedList = yield Listservice_1.ListService.updateList({ list_id, listData }); // Pass as single object
                res.status(200).json(updatedList);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to update list' });
            }
        });
    }
    // Delete a list
    static deleteList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { list_id } = req.params;
            const user_id = req.headers['user_id'];
            if (!user_id || !list_id) {
                return res.status(400).json({ error: 'List ID and User ID are required' });
            }
            try {
                const success = yield Listservice_1.ListService.deleteList({ list_id, user_id }); // Pass as single object
                if (success) {
                    res.status(200).json({ message: 'List deleted successfully' });
                }
                else {
                    res.status(404).json({ error: 'List not found' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to delete list' });
            }
        });
    }
    // Get lists by board with user verification via token
    static getListsByBoard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { board_id } = req.params;
            const token = req.headers['authorization']; // Authorization header with token
            if (!token || !board_id) {
                return res.status(400).json({ error: 'Authorization token and Board ID are required' });
            }
            try {
                // Step 1: Verify the user ID using the user service
                const userResponse = yield axios_1.default.get(`${userServiceUrl}me`, {
                    headers: { 'Authorization': token }
                });
                const user_id = userResponse.data.id; // Assuming the user service responds with the user object
                if (!user_id) {
                    return res.status(401).json({ error: 'Unauthorized, user not found' });
                }
                // Step 2: Fetch the lists associated with the board and user
                const lists = yield (0, knex_1.default)('lists').where({ board_id, user_id }).select('*');
                if (!lists || lists.length === 0) {
                    return res.status(404).json({ error: 'No lists found for this board' });
                }
                // Step 3: Respond with the lists
                res.status(200).json(lists);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to fetch lists' });
            }
        });
    }
}
exports.ListController = ListController;
