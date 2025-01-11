import { Request, Response } from 'express';
import axios from 'axios';
import { CardService } from '../services/cardservice';
import { Card } from '../Model/cardmodel';
import { sendNotification } from '../services/notificationService';
import sendEmail from '../services/emailservice';

export class CardController {
  static async createCard(req: Request, res: Response): Promise<any> {
    const { title, description, column_id, due_date, status = 'pending' } = req.body as Card; // Default status to 'pending' if not provided
    const user_id = req.headers['user_id'] as string | string[];

    if (!user_id || !column_id || !title) {
      return res.status(400).json({ error: 'User ID, Column ID, and Card title are required' });
    }

    const userId = Array.isArray(user_id) ? user_id[0] : user_id;

    try {
      const userResponse = await axios.get(`http://localhost:4040/api/users/${userId}`);
      if (!userResponse.data) {
        return res.status(403).json({ error: 'User not found' });
      }

      const cardData: Card = { title, description, column_id, due_date, status };

      const newCard = await CardService.createCard(cardData);

      await sendNotification({
        user_id: userId,
        message: `A new card titled "${newCard.title}" has been created in your board.`,
        timestamp: new Date(),
      });

      const userEmail = userResponse.data.email;
      if (userEmail) {
        await sendEmail({
          to: userEmail,
          subject: 'New Card Created',
          text: `Your new card titled "${newCard.title}" has been created successfully.`,
        });
      }

      res.status(201).json(newCard);
    } catch (error) {
      console.error('Error creating card:', error);
      res.status(500).json({ error: 'Failed to create card' });
    }
  }

  static async getCardsInColumn(req: Request, res: Response): Promise<any> {
    const { column_id } = req.params;
    const user_id = req.headers['user_id'] as string | string[];

    if (!user_id || !column_id) {
      return res.status(400).json({ error: 'Column ID and User ID are required' });
    }

    const userId = Array.isArray(user_id) ? user_id[0] : user_id;

    try {
      const userResponse = await axios.get(`http://localhost:4040/api/users/${user_id}`);
      if (!userResponse.data) {
        return res.status(403).json({ error: 'User not found' });
      }

      const cards = await CardService.getCardsInColumn(column_id);
      res.status(200).json(cards);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch cards' });
    }
  }

  static async getCardById(req: Request, res: Response): Promise<any> {
    const { card_id } = req.params;
    const user_id = req.headers['user_id'] as string | string[];

    if (!user_id || !card_id) {
      return res.status(400).json({ error: 'Card ID and User ID are required' });
    }

    const userId = Array.isArray(user_id) ? user_id[0] : user_id;

    try {
      const userResponse = await axios.get(`http://localhost:4040/api/users/${user_id}`);
      if (!userResponse.data) {
        return res.status(403).json({ error: 'User not found' });
      }

      const card = await CardService.getCardById(card_id);
      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }
      res.status(200).json(card);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch card' });
    }
  }

  static async updateCard(req: Request, res: Response): Promise<any> {
    const { card_id } = req.params;
    const { title, description, column_id, due_date, status } = req.body as Card; 
    const user_id = req.headers['user_id'] as string | string[];

    if (!user_id || !card_id) {
      return res.status(400).json({ error: 'Card ID and User ID are required' });
    }

    const userId = Array.isArray(user_id) ? user_id[0] : user_id;

    try {
      const userResponse = await axios.get(`http://localhost:4040/api/users/${user_id}`);
      if (!userResponse.data) {
        return res.status(403).json({ error: 'User not found' });
      }

      const cardData: Partial<Card> = { title, description, column_id, due_date, status }; // Include status in update
      const updatedCard = await CardService.updateCard(card_id, cardData);
      res.status(200).json(updatedCard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update card' });
    }
  }

  static async deleteCard(req: Request, res: Response): Promise<any> {
    const { card_id } = req.params;
    const user_id = req.headers['user_id'] as string | string[];

    if (!user_id || !card_id) {
      return res.status(400).json({ error: 'Card ID and User ID are required' });
    }

    const userId = Array.isArray(user_id) ? user_id[0] : user_id;

    try {
      const userResponse = await axios.get(`http://localhost:4040/api/users/${user_id}`);
      if (!userResponse.data) {
        return res.status(403).json({ error: 'User not found' });
      }

      const success = await CardService.deleteCard(card_id);
      if (!success) {
        return res.status(404).json({ error: 'Card not found or could not be deleted' });
      }

      res.status(200).json({ message: 'Card deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete card' });
    }
  }
}
