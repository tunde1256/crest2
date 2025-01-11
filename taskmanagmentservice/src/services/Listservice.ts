import knex from '../db/knex';
import { List } from '../Model/listModel';

class ListService {
  static async createList(listData: Partial<List>) {
    return knex('lists').insert(listData).returning('*');
  }

  static async getListsInBoard({ board_id, user_id }: { board_id: string, user_id: string }) {
    return knex('lists').where({ board_id, user_id }).select('*');
  }

  static async getListById({ list_id, user_id }: { list_id: string, user_id: string }) {
    return knex('lists').where({ list_id, user_id }).first();
  }

  static async updateList({ list_id, listData }: { list_id: string, listData: Partial<List> }) {
    return knex('lists').where({ list_id }).update(listData).returning('*');
  }

  static async deleteList({ list_id, user_id }: { list_id: string, user_id: string }) {
    return knex('lists').where({ list_id, user_id }).del();
  }
}

export { ListService };
