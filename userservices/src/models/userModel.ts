import knex from '../knex';

export interface User {
  id?: number;
  fullname: string;
  email: string;
  password: string;
  gender: string;
  phoneNumber: string;
  profilePicture?: string;
}

export class UserModel {
  static async getAll(): Promise<User[]> {
    return knex('users').select('*');
  }

  static async getById(id: number): Promise<User | undefined> {
    return knex('users').where({ id }).first();
  }

  static async create(user: Omit<User, 'id'>): Promise<User> {
    const [insertedUserId] = await knex('users')
      .insert(user)
      .returning('id');
    const newUser = await knex('users')
      .where('id', insertedUserId)
      .first();
    return newUser;
  }

  static async update(id: number, user: Partial<User>): Promise<number> {
    return knex('users').where({ id }).update(user);
  }

  static async delete(id: number): Promise<number> {
    return knex('users').where({ id }).delete();
  }

  static async getByEmail(email: string): Promise<User | undefined> {
    return knex<User>('users').where({ email }).first();
  }
}
