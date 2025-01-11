import knex from '../db/knex';

export interface List {
  id?: string;
  name: string;
  description: string;
  board_id: string; 
  created_at?: string;
  updated_at?: string;
  user_id?: string; 
}

export class ListModel {
  static async createList(list: List): Promise<List> {
    const [newList] = await knex('lists')
      .insert(list)
      .returning('*');
    return newList;
  }

  static async getListsByBoard(board_id: string): Promise<List[]> {
    const lists = await knex('lists').where({ board_id }).select('*');
    return lists;
  }

  static async getListById(list_id: string): Promise<List | null> {
    const list = await knex('lists').where({ id: list_id }).first();
    return list || null;
  }

  static async updateList(list_id: string, listData: Partial<List>): Promise<List> {
    const [updatedList] = await knex('lists')
      .where({ id: list_id })
      .update(listData)
      .returning('*');
    return updatedList;
  }

  static async deleteList(list_id: string): Promise<boolean> {
    const rowsDeleted = await knex('lists').where({ id: list_id }).del();
    return rowsDeleted > 0;
  }
}
