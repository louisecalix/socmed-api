import { connection } from '../core/database.js';

class Notification {
    constructor() {
        this.db = connection;
  }

    // For creating new notif
    async createNotification(user_id, from_user_id, type, post_id = null, message) {
        try {
            const [results,] = await this.db.execute(
                `INSERT INTO notifications (user_id, from_user_id, type, post_id, message_in_notif) VALUES (?, ?, ?, ?, ?)`,
                [user_id, from_user_id, type, post_id || null, message]
            );

            const [response] = await this.db.execute(
                'SELECT file_path FROM upload_image WHERE user_id = ?',
                [user_id]
            );

            const [username] = await this.db.execute(
                'SELECT username FROM profiles WHERE user_id = ?',
                [user_id]
            );

            const user_name = username[0].username;




            return {
                user_name,
                user_id,
                from_user_id,
                type,
                post_id,
                message,
                file_path: response.length ? response[0].file_path : null
            };
        } 
        catch (err) {
            console.error('<error> notification.createNotification', err);
            throw err;
        }
    }



  // Delete a notification
    async deleteNotification(user_id,notification_id) {
        try {
            const [results,] = await this.db.execute(
                `DELETE FROM notifications WHERE user_id = ? AND notification_id = ?`,
                [user_id,notification_id]
            );
            return results.affectedRows > 0;
        } 
        catch (err) {
            console.error('<error> notification.deleteNotification', err);
            throw err;
        }
    }

  // Mark a notification as read
    async markAsRead(user_id,notification_id) {
        try {
            const [results,] = await this.db.execute(
                `UPDATE notifications SET status = ? WHERE user_id = ? AND notification_id = ?`,
                ['read',user_id,notification_id]
            );
            return results;
        } 
        catch (err) {
            console.error('<error> notification.markAsRead', err);
            throw err;
        }
    }

  // Fetch notifications for a user
    async getUserNotifications(user_id) {
        try {
            const [notifications] = await this.db.execute(
                `SELECT n.notification_id, n.user_id, n.type, n.message_in_notif, n.created_at, 
                        p.username AS from_username, 
                        u.file_path AS from_user_pfp
                FROM notifications n
                JOIN profiles p ON n.from_user_id = p.user_id
                LEFT JOIN upload_image u ON u.user_id = n.from_user_id AND u.image_type = 'profile_pic'
                WHERE n.user_id = ?`,
                [user_id]
            );

            // Map the result to a structured object
            const notificationsWithDetails = notifications.map((notification) => ({
                notificationId: notification.notification_id,
                userId: notification.user_id,
                type: notification.type,
                message: notification.message_in_notif,
                createdAt: notification.created_at,
                fromUsername: notification.from_username,
                fromUserPfp: notification.from_user_pfp || null,
                status: notification.status
            }));

            return { success: true, data: notificationsWithDetails };
        } catch (err) {
            console.error('<error> notification.getUserNotifications', err);
            throw err;
        }
    }
// Get a specific notification with username and profile picture of the from_user
    async getNotification(user_id, notification_id) {
        try {
            const [results] = await this.db.execute(
                `SELECT n.*, p.username AS from_username, u.file_path AS from_user_pfp
                FROM notifications n
                JOIN profiles p ON n.from_user_id = p.user_id
                LEFT JOIN upload_image u ON u.user_id = n.from_user_id AND u.image_type = 'profile_pic'
                WHERE n.user_id = ? AND n.notification_id = ?`,
                [user_id, notification_id]
            );

            if (results.length > 0) {
                const notification = results[0];
                return {
                    ...notification,
                    from_username: notification.from_username,
                    from_user_pfp: notification.from_user_pfp || null 
                };
            } else {
                return null;
            }
        } 
        catch (err) {
            console.error('<error> notification.getNotification', err);
            throw err;
        }
    }

}

export default Notification;
