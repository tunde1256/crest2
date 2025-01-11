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
exports.ListService = void 0;
const knex_1 = __importDefault(require("../db/knex")); // Ensure you're using your Knex setup correctly
class ListService {
    // Create a list in a board
    static createList(listData) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)('lists').insert(listData).returning('*'); // Insert and return the new list
        });
    }
    // Get all lists in a specific board
    static getListsInBoard(_a) {
        return __awaiter(this, arguments, void 0, function* ({ board_id, user_id }) {
            return (0, knex_1.default)('lists').where({ board_id, user_id }).select('*');
        });
    }
    // Get a list by ID
    static getListById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ list_id, user_id }) {
            return (0, knex_1.default)('lists').where({ list_id, user_id }).first();
        });
    }
    // Update a list
    static updateList(_a) {
        return __awaiter(this, arguments, void 0, function* ({ list_id, listData }) {
            return (0, knex_1.default)('lists').where({ list_id }).update(listData).returning('*');
        });
    }
    // Delete a list
    static deleteList(_a) {
        return __awaiter(this, arguments, void 0, function* ({ list_id, user_id }) {
            return (0, knex_1.default)('lists').where({ list_id, user_id }).del();
        });
    }
}
exports.ListService = ListService;
