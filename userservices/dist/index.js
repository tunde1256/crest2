"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Ensure .env is loaded first
// Verify that dotenv loaded the variables
console.log('Environment Variables Loaded:');
console.log('PORT:', process.env.PORT); // Log the value of the PORT from .env
console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET); // Log another variable as a test
const express_1 = __importDefault(require("express"));
const userroutes_1 = __importDefault(require("./routes/userroutes"));
const db_1 = __importDefault(require("./db/db"));
const port = process.env.PORT || 3000; // Use the PORT defined in .env, fallback to 3000 if not set
const app = (0, express_1.default)();
(0, db_1.default)(); // Database connection
app.use(express_1.default.json()); // To parse JSON bodies
app.use('/api/users', userroutes_1.default);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
