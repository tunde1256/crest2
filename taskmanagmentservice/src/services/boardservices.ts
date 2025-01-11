import knex from '../db/knex';
import { Board } from '../Model/boardModel';

export const createBoard = async (board: Omit<Board, 'id'>): Promise<number> => {
  const [id] = await knex('boards').insert(board).returning('id');
  return id;
};

export const getUserBoards = async (user_id: number): Promise<Board[]> => {
  return knex('boards').where({ user_id }).select('*');
};

export const getBoardById = async (id: number, user_id: number): Promise<Board | undefined> => {
  return knex('boards').where({ id, user_id }).first();
};

export const updateBoard = async (id: number, user_id: number, data: Partial<Board>): Promise<number> => {
  return knex('boards')
    .where({ id, user_id })
    .update({ ...data, updated_at: knex.fn.now() });
};

export const deleteBoard = async (id: number, user_id: number): Promise<number> => {
  return knex('boards').where({ id, user_id }).del();
};
