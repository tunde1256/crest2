import express, { Request, Response } from 'express';
import axios from 'axios';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './db/knex'; 
import boardRoutes from './routes/boardRoutes';
import cardRoutes from './routes/cardRoutes';
import listRoutes from './routes/listRoutes';



// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 6000;

app.use(bodyParser.json());
app.use(morgan('tiny')); // Request logging
 db();


 // Routes
 app.use('/api/boards', boardRoutes);
 app.use('/api/cards', cardRoutes);
 app.use('/api/lists', listRoutes);




// Error handling middleware


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
