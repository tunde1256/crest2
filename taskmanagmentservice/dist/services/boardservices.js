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
exports.deleteBoard = exports.updateBoard = exports.getBoardById = exports.getUserBoards = exports.createBoard = void 0;
const knex_1 = __importDefault(require("../db/knex"));
// Create a new board with status
const createBoard = (board) => __awaiter(void 0, void 0, void 0, function* () {
    const [id] = yield (0, knex_1.default)('boards').insert(board).returning('id');
    return id;
});
exports.createBoard = createBoard;
// Get all boards for a specific user
const getUserBoards = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, knex_1.default)('boards').where({ user_id }).select('*');
});
exports.getUserBoards = getUserBoards;
// Get a specific board by ID
const getBoardById = (id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, knex_1.default)('boards').where({ id, user_id }).first();
});
exports.getBoardById = getBoardById;
// Update a board, including the status field
const updateBoard = (id, user_id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, knex_1.default)('boards')
        .where({ id, user_id })
        .update(Object.assign(Object.assign({}, data), { updated_at: knex_1.default.fn.now() }));
});
exports.updateBoard = updateBoard;
// Delete a board
const deleteBoard = (id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, knex_1.default)('boards').where({ id, user_id }).del();
});
exports.deleteBoard = deleteBoard;
