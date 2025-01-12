import cron from 'node-cron';
import RoomMessage from './model/roomMessage'; // RoomMessage model
import DirectMessage from './model/directMessages'; // DirectMessage model

const deleteOldMessages = async () => {
  try {
    // Calculate the timestamp for messages older than 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Delete room messages older than 90 days
    const roomMessagesResult = await RoomMessage.deleteMany({
      timestamp: { $lt: ninetyDaysAgo },
    });

    // Delete direct messages older than 90 days
    const directMessagesResult = await DirectMessage.deleteMany({
      timestamp: { $lt: ninetyDaysAgo },
    });

    console.log(
      `Cleanup job completed: Deleted ${roomMessagesResult.deletedCount} room messages and ${directMessagesResult.deletedCount} direct messages`
    );
  } catch (err:any) {
    console.error('Error during cleanup job:', err.message);
  }
};

// Schedule the cleanup job to run every day at midnight
export const scheduleCleanupJobs = () => {
  cron.schedule('0 0 * * *', deleteOldMessages, {
    scheduled: true,
    timezone: 'UTC', // Adjust timezone as necessary
  });

  console.log('Message cleanup job scheduled to run daily at midnight UTC');
};
