
import knex from '../db/knex';

export interface NotificationData {
  user_id: string;
  message: string;
  timestamp: Date;
}

export const saveNotification = async (notificationData: NotificationData): Promise<any> => {
  try {
    const [createdNotification] = await knex('notifications')
      .insert({
        user_id: notificationData.user_id,
        message: notificationData.message,
        timestamp: notificationData.timestamp,
      })
      .returning('*');

    return createdNotification;
  } catch (error) {
    console.error('Error saving notification:', error);
    throw new Error('Failed to save notification');
  }
};

export const sendNotification = async (notification: NotificationData): Promise<void> => {
  try {
    console.log(`Sending notification to user ${notification.user_id}: ${notification.message}`);
  } catch (error:any) {
    console.error(`Failed to send notification: ${error.message}`);
    throw new Error('Notification delivery failed');
  }
};

export const handleNotification = async (
  notificationData: NotificationData,
  options: { saveToDatabase?: boolean; sendDirectly?: boolean } = { saveToDatabase: true, sendDirectly: true }
): Promise<void> => {
  try {
    if (options.saveToDatabase) {
      await saveNotification(notificationData);
    }

    if (options.sendDirectly) {
      await sendNotification(notificationData);
    }
  } catch (error) {
    console.error('Error handling notification:', error);
    throw new Error('Notification handling failed');
  }
};
