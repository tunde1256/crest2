"use strict";
// src/routes/userRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usercontroller_1 = require("../controllers/usercontroller");
const router = (0, express_1.Router)();
router.get('/', usercontroller_1.UserController.getAllUsers);
router.get('/:id', usercontroller_1.UserController.getUserById);
router.post('/register', usercontroller_1.UserController.createUser);
router.put('/:id', usercontroller_1.UserController.updateUser);
router.delete('/:id', usercontroller_1.UserController.deleteUser);
router.post('/login', usercontroller_1.UserController.login);
exports.default = router;
