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
exports.ListModel = void 0;
const knex_1 = __importDefault(require("../db/knex"));
class ListModel {
    // Create a new list
    static createList(list) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [newList] = yield (0, knex_1.default)('lists')
                    .insert(list)
                    .returning('*');
                return newList;
            }
            catch (error) {
                throw new Error('Failed to create list');
            }
        });
    }
    // Get all lists in a specific board
    static getListsByBoard(board_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lists = yield (0, knex_1.default)('lists').where({ board_id }).select('*');
                return lists;
            }
            catch (error) {
                throw new Error('Failed to fetch lists');
            }
        });
    }
    // Get a list by ID
    static getListById(list_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const list = yield (0, knex_1.default)('lists').where({ id: list_id }).first();
                return list || null;
            }
            catch (error) {
                throw new Error('Failed to fetch list');
            }
        });
    }
    // Update a list
    static updateList(list_id, listData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [updatedList] = yield (0, knex_1.default)('lists')
                    .where({ id: list_id })
                    .update(listData)
                    .returning('*');
                return updatedList;
            }
            catch (error) {
                throw new Error('Failed to update list');
            }
        });
    }
    // Delete a list
    static deleteList(list_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rowsDeleted = yield (0, knex_1.default)('lists').where({ id: list_id }).del();
                return rowsDeleted > 0;
            }
            catch (error) {
                throw new Error('Failed to delete list');
            }
        });
    }
}
exports.ListModel = ListModel;
