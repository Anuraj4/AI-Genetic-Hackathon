import React from 'react';
import { AlertTriangle, Clock, MapPin, CheckCircle } from 'lucide-react';
import { Alert } from '../types';

interface AlertPanelProps {
  alerts: Alert[];
  onResolveAlert: (alertId: string) => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onResolveAlert }) => {
  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-950';
      case 'warning': return 'border-orange-500 bg-orange-950';
      case 'info': return 'border-blue-500 bg-blue-950';
      default: return 'border-gray-500 bg-gray-950';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'info': return <AlertTriangle className="w-5 h-5 text-blue-400" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Live Alerts</h3>
        <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
          {alerts.filter(a => !a.resolved).length}
        </span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 p-3 rounded-r-lg ${getAlertColor(alert.type)} transition-all duration-300 ${
              alert.resolved ? 'opacity-50' : 'animate-pulse-slow'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">{alert.title}</h4>
                  <p className="text-sm text-gray-300 mb-2">{alert.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(alert.timestamp)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{alert.zone}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {!alert.resolved && (
                <button
                  onClick={() => onResolveAlert(alert.id)}
                  className="ml-2 p-1 text-gray-400 hover:text-green-400 transition-colors"
                  title="Mark as resolved"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};