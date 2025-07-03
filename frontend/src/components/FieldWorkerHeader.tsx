import React from 'react';
import { Shield, Wifi, WifiOff, Bell } from 'lucide-react';
import { Worker } from '../types';

interface FieldWorkerHeaderProps {
  worker: Worker;
  unreadNotifications: number;
  onStatusChange: (status: Worker['status']) => void;
}

export const FieldWorkerHeader: React.FC<FieldWorkerHeaderProps> = ({
  worker,
  unreadNotifications,
  onStatusChange
}) => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusColor = (status: Worker['status']) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'responding': return 'bg-orange-500';
      case 'on_scene': return 'bg-blue-500';
      case 'busy': return 'bg-red-500';
      case 'off_duty': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getWorkerIcon = (type: Worker['type']) => {
    switch (type) {
      case 'medical': return '🚑';
      case 'security': return '👮';
      case 'fire': return '🚒';
      case 'police': return '🚔';
      case 'maintenance': return '🔧';
      default: return '👤';
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Shield className="text-cyan-400 w-6 h-6" />
            <div>
              <h1 className="text-lg font-bold text-white">Drishti Field</h1>
              <p className="text-xs text-gray-400">Event Safety Response</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-1">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <span className="text-xs text-gray-400">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-400" />
            {unreadNotifications > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotifications}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Worker Info */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getWorkerIcon(worker.type)}</span>
          <div>
            <div className="font-medium text-white">{worker.name}</div>
            <div className="text-sm text-gray-400">{worker.callSign} • {worker.type.charAt(0).toUpperCase() + worker.type.slice(1)}</div>
          </div>
        </div>

        {/* Status Selector */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(worker.status)}`}></div>
          <select
            value={worker.status}
            onChange={(e) => onStatusChange(e.target.value as Worker['status'])}
            className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="available">Available</option>
            <option value="responding">Responding</option>
            <option value="on_scene">On Scene</option>
            <option value="busy">Busy</option>
            <option value="off_duty">Off Duty</option>
          </select>
        </div>
      </div>
    </header>
  );
};