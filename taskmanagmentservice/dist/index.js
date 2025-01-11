"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const knex_1 = __importDefault(require("./db/knex"));
const boardRoutes_1 = __importDefault(require("./routes/boardRoutes"));
const cardRoutes_1 = __importDefault(require("./routes/cardRoutes"));
const listRoutes_1 = __importDefault(require("./routes/listRoutes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 6000;
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('tiny')); // Request logging
(0, knex_1.default)();
// Routes
app.use('/api/boards', boardRoutes_1.default);
app.use('/api/cards', cardRoutes_1.default);
app.use('/api/lists', listRoutes_1.default);
// Error handling middleware
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
