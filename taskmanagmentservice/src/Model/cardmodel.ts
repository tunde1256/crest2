import knex from '../db/knex';

export interface Card {
    id?: string;
    title: string;
    description: string;
    column_id: string;
    due_date?: string;
    status: string;
    created_at?: string;
    updated_at?: string;
}

export class CardModel {
    static async createCard(card: Card): Promise<Card> {
        if (!card.status) {
            card.status = 'pending';
        }

        if (card.due_date) {
            card.due_date = new Date(card.due_date).toISOString().slice(0, 19).replace('T', ' ');
        }

        const [insertedCardId] = await knex('cards').insert(card).returning('id');
        const newCard = await knex('cards').where({ id: insertedCardId }).first();
        return newCard;
    }

    static async getCardsByColumn(column_id: string): Promise<Card[]> {
        const cards = await knex('cards').where({ column_id }).select('*');
        return cards;
    }

    static async getCardById(card_id: string): Promise<Card | null> {
        const card = await knex('cards').where({ id: card_id }).first();
        return card || null;
    }

    static async updateCard(card_id: string, cardData: Partial<Card>): Promise<Card> {
        await knex('cards').where({ id: card_id }).update(cardData);
        const updatedCard = await knex('cards').where({ id: card_id }).first();
        return updatedCard;
    }

    static async deleteCard(card_id: string): Promise<boolean> {
        const rowsDeleted = await knex('cards').where({ id: card_id }).del();
        return rowsDeleted > 0;
    }
}
