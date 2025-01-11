import { Request, Response } from 'express';
import { ListService } from '../services/Listservice';  
import { List } from '../Model/listModel';
import axios from 'axios';
import knex from '../db/knex'; 
import db from '../db/knex';

const userServiceUrl = 'http://localhost:4040/api/users/'; 

export class ListController {
  // Create a list in a board
  static async createList(req: Request, res: Response): Promise<any> {
    const { name, description, board_id } = req.body as List;
    const user_id = req.headers['user_id'] as string; 

    if (!user_id || !board_id || !name) {
      return res.status(400).json({ error: 'User ID, Board ID, and List name are required' });
    }

    try {
      const userResponse = await axios.get(`${userServiceUrl}${user_id}`);
      
      if (!userResponse.data || !userResponse.data.id) {
        return res.status(404).json({ error: 'User not found in User Service' });
      }

      const boardExists = await db('boards').where({ id: board_id }).first();

      if (!boardExists) {
        return res.status(404).json({ error: 'Board not found in the database' });
      }

      const listData: Partial<List> = { name, description, board_id, user_id };
      
      const newList = await ListService.createList(listData);

      res.status(201).json(newList);

    } catch (error: any) {
      if (error.response) {
        console.error(`User service error: ${error.response.status} - ${error.response.data}`);
        res.status(500).json({ error: 'Error communicating with the User Service' });
      } else if (error instanceof Error) {
        // Handle other types of errors
        console.error(error.message);
        res.status(500).json({ error: 'Failed to create list' });
      } else {
        console.error('Unknown error occurred');
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }


  static async getListsInBoard(req: Request, res: Response): Promise<any> {
    const { board_id } = req.params;
    const user_id = req.headers['user_id'] as string;

    if (!user_id || !board_id) {
      return res.status(400).json({ error: 'Board ID and User ID are required' });
    }

    try {
      const lists = await ListService.getListsInBoard({ board_id, user_id }); 
      res.status(200).json(lists);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch lists' });
    }
  }

  static async getListById(req: Request, res: Response): Promise<any> {
    const { list_id } = req.params;
    const user_id = req.headers['user_id'] as string;

    if (!user_id || !list_id) {
      return res.status(400).json({ error: 'List ID and User ID are required' });
    }

    try {
      const list = await ListService.getListById({ list_id, user_id }); 
      if (!list) {
        return res.status(404).json({ error: 'List not found' });
      }
      res.status(200).json(list);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch list' });
    }
  }

  static async updateList(req: Request, res: Response): Promise<any> {
    const { list_id } = req.params;
    const { name, description } = req.body as List;
    const user_id = req.headers['user_id'] as string;

    if (!user_id || !list_id) {
      return res.status(400).json({ error: 'List ID and User ID are required' });
    }

    try {
      const listData: Partial<List> = { name, description };
      const updatedList = await ListService.updateList({ list_id, listData }); // Pass as single object
      res.status(200).json(updatedList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update list' });
    }
  }

  static async deleteList(req: Request, res: Response): Promise<any> {
    const { list_id } = req.params;
    const user_id = req.headers['user_id'] as string;

    if (!user_id || !list_id) {
      return res.status(400).json({ error: 'List ID and User ID are required' });
    }

    try {
      const success = await ListService.deleteList({ list_id, user_id }); 
      if (success) {
        res.status(200).json({ message: 'List deleted successfully' });
      } else {
        res.status(404).json({ error: 'List not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete list' });
    }
  }

  static async getListsByBoard(req: Request, res: Response): Promise<any> {
    const { board_id } = req.params;
    const token = req.headers['authorization'] as string; 

    if (!token || !board_id) {
      return res.status(400).json({ error: 'Authorization token and Board ID are required' });
    }

    try {
      const userResponse = await axios.get(`${userServiceUrl}me`, {
        headers: { 'Authorization': token }
      });

      const user_id = userResponse.data.id; 

      if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized, user not found' });
      }

      const lists = await knex('lists').where({ board_id, user_id }).select('*');

      if (!lists || lists.length === 0) {
        return res.status(404).json({ error: 'No lists found for this board' });
      }

      res.status(200).json(lists);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch lists' });
    }
  }
}
