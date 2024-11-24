import { Router } from 'express';
import NotificationController from '../../controllers/v1/notification.controller.js';
import authentication from "../../middlewares/authentication.js";

const notificationrouter = new Router();
const notificationController = new NotificationController();



notificationrouter.post('/', authentication, notificationController.createNotification.bind(notificationController));
notificationrouter.delete('/:notification_id', authentication, notificationController.deleteNotification.bind(notificationController));
notificationrouter.patch('/:notification_id/read', authentication, notificationController.markAsRead.bind(notificationController));
notificationrouter.get('/', authentication, notificationController.getUserNotifications.bind(notificationController));
notificationrouter.get('/:notification_id', authentication, notificationController.getNotification.bind(notificationController));

export default notificationrouter;
