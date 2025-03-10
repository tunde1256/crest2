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
exports.UserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
const rabbitmq_1 = require("../rabbitmq"); // Import the RabbitMQ helper
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
class UserController {
    static getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.UserModel.getAll();
                return res.status(200).json(users);
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to fetch users', error });
            }
        });
    }
    static getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield userModel_1.UserModel.getById(Number(id));
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.status(200).json(user);
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to fetch user', error });
            }
        });
    }
    static createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullname, email, password, gender, phoneNumber } = req.body;
            try {
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const newUser = yield userModel_1.UserModel.create({ fullname, email, password: hashedPassword, gender, phoneNumber });
                // Send message to RabbitMQ after user creation
                const message = `New user created: ${newUser.fullname} (${newUser.email})`;
                (0, rabbitmq_1.sendToQueue)(message);
                return res.status(201).json({
                    message: 'User created successfully',
                    user: newUser,
                });
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to create user', error });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const user = yield userModel_1.UserModel.getByEmail(email);
                if (!user) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, name: user.fullname }, JWT_SECRET, { expiresIn: '1h' });
                // Send message to RabbitMQ after successful login
                const loginMessage = `User logged in: ${user.fullname} (${user.email})`;
                (0, rabbitmq_1.sendToQueue)(loginMessage);
                return res.status(200).json({ message: 'Login successful', token, user });
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to login', error });
            }
        });
    }
    static uploadProfilePicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                if (!req.file || !req.file.path) {
                    return res.status(400).json({ message: 'No file uploaded' });
                }
                const profilePictureUrl = req.file.path;
                const updated = yield userModel_1.UserModel.update(Number(id), { profilePicture: profilePictureUrl });
                if (updated === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.status(200).json({ message: 'Profile picture uploaded successfully', profilePictureUrl });
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to upload profile picture', error });
            }
        });
    }
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { fullname, email, password, gender, phoneNumber } = req.body;
            try {
                const updateData = { fullname, email, gender, phoneNumber };
                if (password) {
                    updateData.password = yield bcrypt_1.default.hash(password, 10);
                }
                const updated = yield userModel_1.UserModel.update(Number(id), updateData);
                if (updated === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }
                // Send message to RabbitMQ after user update
                const updateMessage = `User updated: ${fullname} (${email})`;
                (0, rabbitmq_1.sendToQueue)(updateMessage);
                return res.status(200).json({ message: 'User updated successfully' });
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to update user', error });
            }
        });
    }
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const deleted = yield userModel_1.UserModel.delete(Number(id));
                if (deleted === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }
                // Send message to RabbitMQ after user deletion
                const deleteMessage = `User deleted: ${id}`;
                (0, rabbitmq_1.sendToQueue)(deleteMessage);
                return res.status(200).json({ message: 'User deleted successfully' });
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to delete user', error });
            }
        });
    }
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ message: 'Logout successful' });
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to logout', error });
            }
        });
    }
}
exports.UserController = UserController;
