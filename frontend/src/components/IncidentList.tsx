import React from 'react';
import { Clock, MapPin, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';
import { FieldIncident } from '../types';

interface IncidentListProps {
  incidents: FieldIncident[];
  workerId: string;
  onAcceptIncident: (incidentId: string) => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  workerId,
  onAcceptIncident
}) => {
  const getSeverityColor = (severity: FieldIncident['severity']) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-950';
      case 'high': return 'border-orange-500 bg-orange-950';
      case 'medium': return 'border-yellow-500 bg-yellow-950';
      case 'low': return 'border-blue-500 bg-blue-950';
      default: return 'border-gray-500 bg-gray-950';
    }
  };

  const getIncidentIcon = (type: FieldIncident['type']) => {
    switch (type) {
      case 'medical': return '🚑';
      case 'security': return '👮';
      case 'fire': return '🚒';
      case 'crowd_control': return '👥';
      case 'maintenance': return '🔧';
      default: return '⚠️';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return 'Calculating...';
    if (distance < 1000) return `${Math.round(distance)}m`;
    return `${(distance / 1000).toFixed(1)}km`;
  };

  // Filter incidents based on worker assignment and proximity
  const availableIncidents = incidents.filter(incident => 
    !incident.assignedWorker && incident.status === 'reported'
  );
  
  const assignedIncidents = incidents.filter(incident => 
    incident.assignedWorker === workerId
  );

  return (
    <div className="space-y-4">
      {/* Assigned Incidents */}
      {assignedIncidents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Your Assignments ({assignedIncidents.length})</span>
          </h3>
          <div className="space-y-3">
            {assignedIncidents.map((incident) => (
              <div
                key={incident.id}
                className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(incident.severity)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getIncidentIcon(incident.type)}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">{incident.title}</h4>
                      <p className="text-sm text-gray-300 mb-2">{incident.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-400 mb-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(incident.reportedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{incident.location.zone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Navigation className="w-3 h-3" />
                          <span>{formatDistance(incident.distance)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          incident.severity === 'critical' ? 'bg-red-600 text-white' :
                          incident.severity === 'high' ? 'bg-orange-600 text-white' :
                          incident.severity === 'medium' ? 'bg-yellow-600 text-black' :
                          'bg-blue-600 text-white'
                        }`}>
                          {incident.severity.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs capitalize">
                          {incident.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                    Navigate
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Incidents */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          <span>Available Incidents ({availableIncidents.length})</span>
        </h3>
        
        {availableIncidents.length === 0 ? (
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 text-center">
            <div className="text-gray-400 mb-2">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">All Clear</p>
              <p className="text-sm">No incidents in your area requiring attention</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {availableIncidents.map((incident) => (
              <div
                key={incident.id}
                className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(incident.severity)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getIncidentIcon(incident.type)}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">{incident.title}</h4>
                      <p className="text-sm text-gray-300 mb-2">{incident.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-400 mb-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(incident.reportedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{incident.location.zone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Navigation className="w-3 h-3" />
                          <span>{formatDistance(incident.distance)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          incident.severity === 'critical' ? 'bg-red-600 text-white' :
                          incident.severity === 'high' ? 'bg-orange-600 text-white' :
                          incident.severity === 'medium' ? 'bg-yellow-600 text-black' :
                          'bg-blue-600 text-white'
                        }`}>
                          {incident.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400">
                          ETA: ~{incident.estimatedDuration}min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onAcceptIncident(incident.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Accept Assignment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};