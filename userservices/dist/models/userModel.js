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
exports.UserModel = void 0;
const knex_1 = __importDefault(require("../knex"));
class UserModel {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)('users').select('*');
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)('users').where({ id }).first();
        });
    }
    static create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const [insertedUserId] = yield (0, knex_1.default)('users')
                .insert(user)
                .returning('id');
            const newUser = yield (0, knex_1.default)('users')
                .where('id', insertedUserId)
                .first();
            return newUser;
        });
    }
    static update(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)('users').where({ id }).update(user);
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)('users').where({ id }).delete();
        });
    }
    static getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)('users').where({ email }).first();
        });
    }
}
exports.UserModel = UserModel;
