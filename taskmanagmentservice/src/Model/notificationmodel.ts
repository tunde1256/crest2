import knex from '../db/knex';

export interface NotificationData {
  user_id: string;
  message: string;
  timestamp: Date;
}

export class Notification {
  static async create(notificationData: NotificationData): Promise<any> {
    const [createdNotification] = await knex('notifications')
      .insert({
        user_id: notificationData.user_id,
        message: notificationData.message,
        timestamp: notificationData.timestamp
      })
      .returning('*');

    return createdNotification;
  }
}
