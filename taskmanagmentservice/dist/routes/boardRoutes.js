"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const boardController_1 = require("../Controller/boardController");
const router = express_1.default.Router();
router.post('/create', boardController_1.createBoard);
router.get('/get', boardController_1.getUserBoards);
router.get('/boards/:id', boardController_1.getBoardById);
router.put('/boards/:id', boardController_1.updateBoard);
router.delete('/boards/:id', boardController_1.deleteBoard);
// New routes for collaborators
router.post('/boards/:id/collaborators', boardController_1.addCollaborator);
router.get('/boards/:id/collaborators', boardController_1.getCollaborators);
router.delete('/boards/collaborators/:id', boardController_1.deleteCollaborator);
exports.default = router;
