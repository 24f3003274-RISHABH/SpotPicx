import mongoose from 'mongoose';
import { Notification, INotification, NotificationType } from '../models/Notification';
import { dbConnection } from '../config/db';

export interface InMemoryNotification {
  _id: string;
  recipient: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const inMemoryNotifications: InMemoryNotification[] = [
  {
    _id: 'notif-1',
    recipient: 'usr-aarav',
    type: 'REVIEW_RESPONSE',
    title: 'Business responded to your review',
    message: 'Hauz Khas Social replied: "Thank you Aarav! We are thrilled you enjoyed the sunset balcony view..."',
    link: '/spots/social-hauz-khas',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'notif-2',
    recipient: 'usr-aarav',
    type: 'REVIEW_LIKED',
    title: 'Your review received 5 likes',
    message: 'Delhiites found your review on AMA Cafe helpful!',
    link: '/spots/ama-cafe-mkt',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

export class NotificationService {
  public static async createNotification(data: {
    recipient: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    metadata?: Record<string, any>;
  }) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const notif = new Notification({
          recipient: new mongoose.Types.ObjectId(data.recipient),
          type: data.type,
          title: data.title,
          message: data.message,
          link: data.link || '',
          metadata: data.metadata || {},
          isRead: false,
        });
        await notif.save();
        return notif;
      } catch (e) {
        console.warn('[NotificationService] DB createNotification error', e);
      }
    }

    const newNotif: InMemoryNotification = {
      _id: `notif-${Date.now()}`,
      recipient: data.recipient,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link,
      isRead: false,
      metadata: data.metadata,
      createdAt: new Date(),
    };

    inMemoryNotifications.unshift(newNotif);
    return newNotif;
  }

  public static async getUserNotifications(userId: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const notifs = await Notification.find({
          recipient: new mongoose.Types.ObjectId(userId),
        })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean();

        const unreadCount = notifs.filter((n) => !n.isRead).length;
        return { notifications: notifs, unreadCount };
      } catch (e) {
        console.warn('[NotificationService] DB getUserNotifications error', e);
      }
    }

    // In-memory filter (match user or return general for demo user)
    const userNotifs = inMemoryNotifications.filter(
      (n) => n.recipient === userId || n.recipient === 'usr-aarav'
    );
    const unreadCount = userNotifs.filter((n) => !n.isRead).length;

    return { notifications: userNotifs, unreadCount };
  }

  public static async markAsRead(notificationId: string, userId: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        await Notification.findOneAndUpdate(
          { _id: notificationId, recipient: userId },
          { isRead: true }
        );
        return { success: true };
      } catch (e) {
        console.warn('[NotificationService] DB markAsRead error', e);
      }
    }

    const n = inMemoryNotifications.find((item) => item._id === notificationId);
    if (n) n.isRead = true;
    return { success: true };
  }

  public static async markAllAsRead(userId: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
        return { success: true };
      } catch (e) {
        console.warn('[NotificationService] DB markAllAsRead error', e);
      }
    }

    inMemoryNotifications.forEach((n) => {
      if (n.recipient === userId || n.recipient === 'usr-aarav') {
        n.isRead = true;
      }
    });

    return { success: true };
  }
}
