import dotenv from 'dotenv';
dotenv.config();

console.log('Environment Variables Loaded:');
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET);

import express, { Application } from 'express';
import userRoutes from './routes/userroutes';
import db from './db/db';

const port = process.env.PORT || 3000;

const app: Application = express();
db();
app.use(express.json());
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
