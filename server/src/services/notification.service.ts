import mongoose from 'mongoose';
import { Notification, INotification, NotificationType } from '../models/Notification';
import { User } from '../models/User';
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
    link: '/spots/social-offline-hauz-khas',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'notif-2',
    recipient: 'usr-aarav',
    type: 'NEW_OFFER',
    title: '🔥 New Offer at Blue Tokai Saket',
    message: 'Flat 20% Off Pour-Overs & Fresh Bakery Baskets is now active at your saved spot.',
    link: '/offers',
    metadata: { offerId: 'offer_1', businessId: 'spot-1' },
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    _id: 'notif-3',
    recipient: 'usr-aarav',
    type: 'EVENT_ALERT',
    title: '⚡ Happening Tonight: Late Night Standup Comedy',
    message: 'Delhi Stand-up Comedy Showcase starts at 8:30 PM in GK-2.',
    link: '/events',
    metadata: { eventId: 'evt_3' },
    isRead: true,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    _id: 'notif-4',
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
  /**
   * Anti-Spam Check: Ensures user doesn't receive duplicate notifications for the same entity within 24h
   */
  private static async isSpammy(
    recipientId: string,
    type: NotificationType,
    entityId?: string
  ): Promise<boolean> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (dbConnection.getStatus().isConnected) {
      try {
        const query: any = {
          recipient: recipientId,
          type,
          createdAt: { $gte: oneDayAgo },
        };
        if (entityId) {
          query['metadata.entityId'] = entityId;
        }
        const count = await Notification.countDocuments(query);
        return count > 0;
      } catch {
        // Fallback
      }
    }

    return inMemoryNotifications.some((n) => {
      const matchRecipient = n.recipient === recipientId || n.recipient === 'usr-aarav';
      const matchType = n.type === type;
      const recent = new Date(n.createdAt) >= oneDayAgo;
      const matchEntity = entityId ? n.metadata?.entityId === entityId || n.metadata?.offerId === entityId || n.metadata?.eventId === entityId : true;
      return matchRecipient && matchType && recent && matchEntity;
    });
  }

  /**
   * Create a notification with anti-spam enforcement and user preference checking
   */
  public static async createNotification(data: {
    recipient: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    metadata?: Record<string, any>;
  }) {
    // Check anti-spam
    const entityId = data.metadata?.entityId || data.metadata?.offerId || data.metadata?.eventId || data.metadata?.businessId;
    const spam = await this.isSpammy(data.recipient, data.type, entityId);
    if (spam) {
      return null; // Suppressed by anti-spam logic
    }

    if (dbConnection.getStatus().isConnected) {
      try {
        // Check user preferences if available
        const user = await User.findById(data.recipient).select('notificationPreferences');
        if (user && user.notificationPreferences) {
          const prefs = user.notificationPreferences;
          if (data.type === 'NEW_OFFER' && prefs.offers === false) return null;
          if (data.type === 'EVENT_ALERT' && prefs.events === false) return null;
          if (data.type === 'SAVED_PLACE_UPDATE' && prefs.savedPlaceUpdates === false) return null;
          if (data.type === 'BUSINESS_UPDATE' && prefs.businessUpdates === false) return null;
        }

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
      _id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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

  /**
   * Notify users about a new offer (e.g. when business publishes deal)
   */
  public static async notifyNewOffer(offer: any) {
    return this.createNotification({
      recipient: 'usr-aarav',
      type: 'NEW_OFFER',
      title: `🔥 New Deal: ${offer.discount} at ${offer.business?.name || 'Local Spot'}`,
      message: `${offer.title} is now active. Use code: ${offer.couponCode}`,
      link: '/offers',
      metadata: { offerId: offer._id, businessId: offer.business?._id || offer.business },
    });
  }

  /**
   * Notify users about an upcoming event
   */
  public static async notifyEventAlert(event: any) {
    return this.createNotification({
      recipient: 'usr-aarav',
      type: 'EVENT_ALERT',
      title: `⚡ Upcoming Event: ${event.title}`,
      message: `Happening at ${event.venue} (${event.location?.locality || 'Delhi NCR'}). Reserve passes now.`,
      link: '/events',
      metadata: { eventId: event._id },
    });
  }

  /**
   * Notify users about a saved place update
   */
  public static async notifySavedPlaceUpdate(business: any, updateSummary: string) {
    return this.createNotification({
      recipient: 'usr-aarav',
      type: 'SAVED_PLACE_UPDATE',
      title: `📍 Update from ${business.name}`,
      message: updateSummary,
      link: `/spots/${business.slug || business._id}`,
      metadata: { businessId: business._id, entityId: business._id },
    });
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

