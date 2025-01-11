import { CardModel, Card } from '../Model/cardmodel';

export class CardService {
  static async createCard(card: Card): Promise<Card> {
    try {
      const newCard = await CardModel.createCard(card);
      if (!newCard) {
        throw new Error('Failed to create the card');
      }
      return newCard;
    } catch (error) {
      console.error('Error in createCard:', error);
      throw new Error('Service: Failed to create card');
    }
  }

  static async getCardsInColumn(column_id: string): Promise<Card[]> {
    try {
      const cards = await CardModel.getCardsByColumn(column_id);
      if (!cards) {
        throw new Error('No cards found in this column');
      }
      return cards;
    } catch (error) {
      console.error('Error in getCardsInColumn:', error);
      throw new Error('Service: Failed to fetch cards');
    }
  }

  static async getCardById(card_id: string): Promise<Card | null> {
    try {
      const card = await CardModel.getCardById(card_id);
      if (!card) {
        throw new Error('Card not found');
      }
      return card;
    } catch (error) {
      console.error('Error in getCardById:', error);
      throw new Error('Service: Failed to fetch card');
    }
  }

  static async updateCard(card_id: string, cardData: Partial<Card>): Promise<Card> {
    try {
      const updatedCard = await CardModel.updateCard(card_id, cardData);
      if (!updatedCard) {
        throw new Error('Card update failed');
      }
      return updatedCard;
    } catch (error) {
      console.error('Error in updateCard:', error);
      throw new Error('Service: Failed to update card');
    }
  }

  static async deleteCard(card_id: string): Promise<boolean> {
    try {
      const success = await CardModel.deleteCard(card_id);
      if (!success) {
        throw new Error('Failed to delete the card');
      }
      return success;
    } catch (error) {
      console.error('Error in deleteCard:', error);
      throw new Error('Service: Failed to delete card');
    }
  }
}
