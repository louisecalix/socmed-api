import Notification from "../../models/notification.model.js";

class NotificationController {
    constructor() {
        this.notification = new Notification();
    }

    // Create a new notification
    async createNotification(req, res) {
        const sender_id = res.locals.user_id;
        const { user_id, type, related_id, message } = req.body || {};

        if (!user_id || !type || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields.',
            });
        }

        try {
            const result = await this.notification.createNotification(user_id, sender_id, type, related_id, message);
            return res.status(201).json({
                success: true,
                data: result,
            });
        } catch (err) {
            console.error('<error> notification.createNotification', err);
            return res.status(500).json({
                success: false,
                message: err.toString(),
            });
        }
    }

    // Delete a notification
    async deleteNotification(req, res) {
        const user_id = res.locals.user_id;
        const { notification_id } = req.params;

        try {
            const result = await this.notification.deleteNotification(user_id, notification_id);
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification not found.',
                });
            }
            return res.json({
                success: true,
                data: result,
            });
        } catch (err) {
            console.error('<error> notification.deleteNotification', err);
            return res.status(500).json({
                success: false,
                message: err.toString(),
            });
        }
    }

    // Mark notification as read
    async markAsRead(req, res) {
        const user_id = res.locals.user_id;
        const { notification_id } = req.params;

        try {
            const result = await this.notification.markAsRead(user_id, notification_id);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification not found.',
                });
            }

            return res.json({
                success: true,
                message: 'Notification updated successfully.',
            });
        } catch (err) {
            console.error('<error> notification.markAsRead', err);
            return res.status(500).json({
                success: false,
                message: err.toString(),
            });
        }
    }

    // Get all notifications for a user
    async getUserNotifications(req, res) {
        const user_id = res.locals.user_id;

        try {
            const result = await this.notification.getUserNotifications(user_id);
            return res.json({
                success: true,
                data: result,
            });
        } catch (err) {
            console.error('<error> notification.getUserNotifications', err);
            return res.status(500).json({
                success: false,
                message: err.toString(),
            });
        }
    }

    // Get a specific notification by ID
    async getNotification(req, res) {
        const user_id = res.locals.user_id;
        const { notification_id } = req.params;

        try {
            const result = await this.notification.getNotification(user_id, notification_id);
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification not found.',
                });
            }
            return res.json({
                success: true,
                data: result,
            });
        } catch (err) {
            console.error('<error> notification.getNotification', err);
            return res.status(500).json({
                success: false,
                message: err.toString(),
            });
        }
    }
}

export default NotificationController;
