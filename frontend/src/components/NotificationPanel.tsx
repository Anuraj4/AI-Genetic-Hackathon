import React from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { Notification } from '../types';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkRead: (notificationId: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onMarkRead
}) => {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'incident_assigned': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'incident_update': return <Info className="w-5 h-5 text-blue-400" />;
      case 'emergency_alert': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'system_message': return <Bell className="w-5 h-5 text-gray-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-950';
      case 'high': return 'border-orange-500 bg-orange-950';
      case 'medium': return 'border-yellow-500 bg-yellow-950';
      case 'low': return 'border-blue-500 bg-blue-950';
      default: return 'border-gray-500 bg-gray-950';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Notifications</h2>
        <div className="flex items-center space-x-2">
          <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            {unreadNotifications.length}
          </span>
          <button className="text-cyan-400 text-sm hover:text-cyan-300">
            Mark all read
          </button>
        </div>
      </div>

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-orange-400" />
            <span>New ({unreadNotifications.length})</span>
          </h3>
          <div className="space-y-3">
            {unreadNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-l-4 p-4 rounded-r-lg ${getPriorityColor(notification.priority)} animate-pulse-slow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">{notification.title}</h4>
                      <p className="text-sm text-gray-300 mb-2">{notification.message}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(notification.timestamp)}</span>
                        </div>
                        {notification.actionRequired && (
                          <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium">
                            Action Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onMarkRead(notification.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-green-400 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>

                {notification.actionRequired && (
                  <div className="mt-3 flex space-x-2">
                    <button className="bg-cyan-600 hover:bg-cyan-700 text-white py-1 px-3 rounded text-sm transition-colors">
                      View Details
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm transition-colors">
                      Take Action
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Read Notifications */}
      {readNotifications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Recent ({readNotifications.length})</span>
          </h3>
          <div className="space-y-3">
            {readNotifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                className={`border-l-4 p-4 rounded-r-lg opacity-60 ${getPriorityColor(notification.priority)}`}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">{notification.title}</h4>
                    <p className="text-sm text-gray-300 mb-2">{notification.message}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(notification.timestamp)}</span>
                      </div>
                      <span className="text-green-400">✓ Read</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-8 text-center">
          <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Notifications</h3>
          <p className="text-gray-400">You're all caught up! New alerts will appear here.</p>
        </div>
      )}
    </div>
  );
};