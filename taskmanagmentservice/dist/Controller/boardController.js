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
exports.getCollaborators = exports.deleteBoard = exports.deleteCollaborator = exports.updateBoard = exports.getBoardById = exports.getUserBoards = exports.uploadFile = exports.addCollaborator = exports.createBoard = void 0;
const knex_1 = __importDefault(require("../db/knex"));
const axios_1 = __importDefault(require("axios"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const multer_1 = __importDefault(require("../config/multer"));
const notificationService_1 = require("../services/notificationService"); // Import the notification service
const emailservice_1 = __importDefault(require("../services/emailservice")); // Consistent import of the email service
// Create a new board
// Create a new board
const createBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, collaborator_id, status } = req.body; // Include status
    const user_id = Array.isArray(req.headers['user_id']) ? req.headers['user_id'][0] : req.headers['user_id'];
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        // Validate the user from the userservice database
        const userResponse = yield axios_1.default.get(`http://localhost:4040/api/users/${user_id}`);
        if (!userResponse.data) {
            return res.status(404).json({ error: 'User not found in userservice' });
        }
        // Create the board in the boards table (include status)
        const [board_id] = yield (0, knex_1.default)('boards')
            .insert({ name, description, status, user_id }) // Include status in insert
            .returning('id');
        // Send email to the board owner
        yield (0, emailservice_1.default)({
            to: userResponse.data.email,
            subject: 'Board Created Successfully',
            text: `Your board "${name}" has been created successfully.`,
        });
        // Send notification to the board owner
        yield (0, notificationService_1.sendNotification)({
            user_id,
            message: `Your board "${name}" has been created successfully.`,
            timestamp: new Date()
        });
        // Add collaborator if provided
        if (collaborator_id) {
            const collaboratorResponse = yield axios_1.default.get(`http://localhost:4040/api/users/${user_id}`);
            if (!collaboratorResponse.data) {
                return res.status(404).json({ error: 'Collaborator not found in userservice' });
            }
            // Add to the collaborators table
            yield (0, knex_1.default)('collaborators')
                .insert({ board_id, user_id: collaborator_id });
            // Send email to the collaborator
            yield (0, emailservice_1.default)({
                to: collaboratorResponse.data.email,
                subject: 'Added as Collaborator',
                text: `You have been added as a collaborator to the board: ${name}`,
            });
            // Send notification to the collaborator
            yield (0, notificationService_1.sendNotification)({
                user_id: collaborator_id,
                message: `You have been added as a collaborator to board: ${name}`,
                timestamp: new Date()
            });
        }
        res.status(201).json({ board_id, message: 'Board created successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create board' });
    }
});
exports.createBoard = createBoard;
// Add collaborator to a board
const addCollaborator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { board_id, user_id } = req.body;
    const owner_id = Array.isArray(req.headers['user_id']) ? req.headers['user_id'][0] : req.headers['user_id'];
    if (!owner_id || !board_id || !user_id) {
        return res.status(400).json({ error: 'Board ID, User ID, and Owner ID are required' });
    }
    try {
        // Verify board ownership
        const board = yield (0, knex_1.default)('boards').where({ id: board_id, user_id: owner_id }).first();
        if (!board) {
            return res.status(403).json({ error: 'You do not have permission to add collaborators to this board' });
        }
        // Add collaborator to the board
        yield (0, knex_1.default)('board_collaborators').insert({ board_id, user_id });
        // Send notification to the collaborator
        yield (0, notificationService_1.sendNotification)({
            user_id,
            message: `You have been added as a collaborator to board: ${board.name}`,
            timestamp: new Date()
        });
        // Send email to the collaborator
        const collaboratorEmailResponse = yield axios_1.default.get(`http://userservice/api/users/${user_id}`);
        yield (0, emailservice_1.default)({
            to: collaboratorEmailResponse.data.email,
            subject: 'Added as Collaborator',
            text: `You have been added as a collaborator to the board: ${board.name}`,
        });
        res.status(201).json({ message: 'Collaborator added successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add collaborator' });
    }
});
exports.addCollaborator = addCollaborator;
// Upload file to Cloudinary
const uploadFile = (req, res) => {
    (0, multer_1.default)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        try {
            // Upload the file buffer to Cloudinary
            const result = yield cloudinary_1.default.uploader.upload_stream({ resource_type: 'auto' }, // Automatically detect file type (image/video)
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
                }
                const fileUrl = result === null || result === void 0 ? void 0 : result.secure_url; // Get the secure URL for the uploaded file
                res.status(200).json({ message: 'File uploaded successfully', fileUrl });
            });
            // Pipe file buffer to Cloudinary stream
            req.pipe(result);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error uploading file' });
        }
    }));
};
exports.uploadFile = uploadFile;
// Get all boards for a specific user
const getUserBoards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = Array.isArray(req.headers['user_id']) ? req.headers['user_id'][0] : req.headers['user_id'];
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const boards = yield (0, knex_1.default)('boards').where({ user_id }).select('*');
        res.status(200).json(boards);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch boards' });
    }
});
exports.getUserBoards = getUserBoards;
// Get a specific board by ID
const getBoardById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user_id = Array.isArray(req.headers['user_id']) ? req.headers['user_id'][0] : req.headers['user_id'];
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const board = yield (0, knex_1.default)('boards').where({ id, user_id }).first();
        if (!board) {
            return res.status(404).json({ error: 'Board not found or unauthorized' });
        }
        res.status(200).json(board);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch board' });
    }
});
exports.getBoardById = getBoardById;
// Update a board
// Update a board
// Update a board
const updateBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description, status } = req.body; // Include status in request body
    const user_id = Array.isArray(req.headers['user_id']) ? req.headers['user_id'][0] : req.headers['user_id'];
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const updated = yield (0, knex_1.default)('boards')
            .where({ id, user_id })
            .update({ name, description, status, updated_at: knex_1.default.fn.now() }); // Include status in update
        if (!updated) {
            return res.status(404).json({ error: 'Board not found or unauthorized' });
        }
        // Send notification to the board owner about the update
        yield (0, notificationService_1.sendNotification)({
            user_id,
            message: `Your board "${name}" has been updated successfully.`,
            timestamp: new Date()
        });
        res.status(200).json({ message: 'Board updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update board' });
    }
});
exports.updateBoard = updateBoard;
const deleteCollaborator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { board_id, user_id } = req.params;
    const collaborator_id = Array.isArray(req.headers['collaborator_id']) ? req.headers['collaborator_id'][0] : req.headers['collaborator_id'];
    if (!collaborator_id || !board_id || !user_id) {
        return res.status(400).json({ error: 'Collaborator ID, Board ID, and User ID are required' });
    }
    try {
        // Verify if the user is the owner of the board
        const board = yield (0, knex_1.default)('boards').where({ id: board_id, user_id }).first();
        if (!board) {
            return res.status(403).json({ error: 'You do not have permission to delete collaborators from this board' });
        }
        // Check if the collaborator exists in the board_collaborators table
        const collaborator = yield (0, knex_1.default)('board_collaborators')
            .where({ board_id, user_id: collaborator_id })
            .first();
        if (!collaborator) {
            return res.status(404).json({ error: 'Collaborator not found on this board' });
        }
        // Delete the collaborator from the board
        yield (0, knex_1.default)('board_collaborators')
            .where({ board_id, user_id: collaborator_id })
            .del();
        // Send notification to the collaborator that they have been removed
        yield (0, notificationService_1.sendNotification)({
            user_id: collaborator_id,
            message: `You have been removed as a collaborator from board: ${board.name}`,
            timestamp: new Date(),
        });
        // Send email to the collaborator about the removal
        const collaboratorEmailResponse = yield axios_1.default.get(`http://localhost:4040/api/users/${collaborator_id}`);
        if (collaboratorEmailResponse.data) {
            yield (0, emailservice_1.default)({
                to: collaboratorEmailResponse.data.email,
                subject: 'Removed as Collaborator',
                text: `You have been removed as a collaborator from the board: ${board.name}`,
            });
        }
        res.status(200).json({ message: 'Collaborator removed successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove collaborator' });
    }
});
exports.deleteCollaborator = deleteCollaborator;
// Delete a board
const deleteBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user_id = Array.isArray(req.headers['user_id']) ? req.headers['user_id'][0] : req.headers['user_id'];
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const deleted = yield (0, knex_1.default)('boards').where({ id, user_id }).del();
        if (!deleted) {
            return res.status(404).json({ error: 'Board not found or unauthorized' });
        }
        res.status(200).json({ message: 'Board deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete board' });
    }
});
exports.deleteBoard = deleteBoard;
// Get all collaborators for a specific board
const getCollaborators = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { board_id } = req.params;
    const user_id = Array.isArray(req.headers['user_id']) ? req.headers['user_id'][0] : req.headers['user_id'];
    if (!user_id || !board_id) {
        return res.status(400).json({ error: 'User ID and Board ID are required' });
    }
    try {
        // Check if the user is the owner of the board (to ensure they can see the collaborators)
        const board = yield (0, knex_1.default)('boards').where({ id: board_id, user_id }).first();
        if (!board) {
            return res.status(403).json({ error: 'You do not have permission to view collaborators for this board' });
        }
        // Get the collaborators for the board
        const collaborators = yield (0, knex_1.default)('board_collaborators')
            .join('users', 'board_collaborators.user_id', '=', 'users.id')
            .where('board_collaborators.board_id', board_id)
            .select('users.id', 'users.email', 'users.name'); // Adjust to include necessary user details
        if (!collaborators.length) {
            return res.status(404).json({ message: 'No collaborators found for this board' });
        }
        res.status(200).json(collaborators);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch collaborators' });
    }
});
exports.getCollaborators = getCollaborators;
