"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const listController_1 = require("../Controller/listController"); // Import your controller
const router = (0, express_1.Router)();
// Route to create a new list
router.post('/lists', listController_1.ListController.createList);
// Route to get all lists for a specific board
router.get('/boards/:board_id/lists', listController_1.ListController.getListsByBoard);
// Route to get a specific list by its ID
router.get('/lists/:list_id', listController_1.ListController.getListById);
// Route to update an existing list
router.put('/lists/:list_id', listController_1.ListController.updateList);
// Route to delete a specific list
router.delete('/lists/:list_id', listController_1.ListController.deleteList);
exports.default = router;
