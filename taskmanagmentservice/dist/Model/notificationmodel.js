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
exports.Notification = void 0;
// models/notificationModel.ts
const knex_1 = __importDefault(require("../db/knex"));
class Notification {
    static create(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [createdNotification] = yield (0, knex_1.default)('notifications')
                    .insert({
                    user_id: notificationData.user_id,
                    message: notificationData.message,
                    timestamp: notificationData.timestamp
                })
                    .returning('*');
                return createdNotification;
            }
            catch (error) {
                console.error('Error saving notification:', error);
                throw new Error('Failed to save notification');
            }
        });
    }
}
exports.Notification = Notification;
