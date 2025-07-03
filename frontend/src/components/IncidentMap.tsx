import React, { useState } from 'react';
import { Navigation, MapPin, Target, Route } from 'lucide-react';
import { Worker, FieldIncident, NavigationRoute } from '../types';

interface IncidentMapProps {
  worker: Worker;
  incidents: FieldIncident[];
  currentRoute?: NavigationRoute;
}

export const IncidentMap: React.FC<IncidentMapProps> = ({
  worker,
  incidents,
  currentRoute
}) => {
  const [selectedIncident, setSelectedIncident] = useState<FieldIncident | null>(null);
  const [showRoute, setShowRoute] = useState(false);

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

  const getSeverityColor = (severity: FieldIncident['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return 'Calculating...';
    if (distance < 1000) return `${Math.round(distance)}m`;
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const formatDuration = (duration: number) => {
    if (duration < 60) return `${duration}min`;
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    return `${hours}h ${mins}m`;
  };

  // Mock map data - in a real app, this would be an actual map component
  const mapBounds = {
    minLat: 40.7100,
    maxLat: 40.7150,
    minLng: -74.0080,
    maxLng: -74.0040
  };

  const getMapPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const workerPos = getMapPosition(worker.position.lat, worker.position.lng);
  const assignedIncidents = incidents.filter(i => i.assignedWorker === worker.id);
  const nearbyIncidents = incidents.filter(i => !i.assignedWorker && (i.distance || 0) <= worker.radius);

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* Map Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Incident Map</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRoute(!showRoute)}
              className={`p-2 rounded-lg transition-colors ${
                showRoute ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              <Route className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
              <Target className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-gray-800 overflow-hidden">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full h-px bg-gray-600" style={{ top: `${i * 10}%` }} />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full w-px bg-gray-600" style={{ left: `${i * 10}%` }} />
            ))}
          </div>

          {/* Zone Labels */}
          <div className="absolute top-4 left-4 text-gray-400 text-sm">Main Stage North</div>
          <div className="absolute top-4 right-4 text-gray-400 text-sm">Food Court East</div>
          <div className="absolute bottom-4 left-4 text-gray-400 text-sm">West Gate</div>
          <div className="absolute bottom-4 right-4 text-gray-400 text-sm">Main Stage South</div>
        </div>

        {/* Worker Position */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ left: `${workerPos.x}%`, top: `${workerPos.y}%` }}
        >
          <div className="relative">
            <div className="w-6 h-6 bg-cyan-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-cyan-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              {worker.callSign}
            </div>
            {/* Worker Radius */}
            <div 
              className="absolute border-2 border-cyan-400 border-dashed rounded-full opacity-30"
              style={{
                width: `${worker.radius / 10}px`,
                height: `${worker.radius / 10}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            ></div>
          </div>
        </div>

        {/* Assigned Incidents */}
        {assignedIncidents.map((incident) => {
          const pos = getMapPosition(incident.location.lat, incident.location.lng);
          return (
            <div
              key={incident.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => setSelectedIncident(incident)}
            >
              <div className={`w-8 h-8 ${getSeverityColor(incident.severity)} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white animate-pulse`}>
                <span className="text-sm">{getIncidentIcon(incident.type)}</span>
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap border border-gray-600">
                {incident.severity.toUpperCase()}
              </div>
            </div>
          );
        })}

        {/* Nearby Incidents */}
        {nearbyIncidents.map((incident) => {
          const pos = getMapPosition(incident.location.lat, incident.location.lng);
          return (
            <div
              key={incident.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => setSelectedIncident(incident)}
            >
              <div className={`w-6 h-6 ${getSeverityColor(incident.severity)} rounded-full border border-gray-400 shadow-lg flex items-center justify-center text-white opacity-70`}>
                <span className="text-xs">{getIncidentIcon(incident.type)}</span>
              </div>
            </div>
          );
        })}

        {/* Route Visualization */}
        {showRoute && currentRoute && (
          <div className="absolute inset-0 z-5">
            <svg className="w-full h-full">
              <path
                d="M 20,80 Q 50,20 80,60"
                stroke="#00D9FF"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Map Controls */}
      <div className="bg-gray-900 border-t border-gray-700 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-cyan-400">{assignedIncidents.length}</div>
            <div className="text-xs text-gray-400">Assigned</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-400">{nearbyIncidents.length}</div>
            <div className="text-xs text-gray-400">Nearby</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">{worker.radius}m</div>
            <div className="text-xs text-gray-400">Radius</div>
          </div>
        </div>
      </div>

      {/* Incident Details Modal */}
      {selectedIncident && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-gray-900 w-full rounded-t-lg border-t border-gray-700 p-4 max-h-1/2 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{selectedIncident.title}</h3>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <p className="text-gray-300">{selectedIncident.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Location:</span>
                  <div className="text-white">{selectedIncident.location.zone}</div>
                </div>
                <div>
                  <span className="text-gray-400">Distance:</span>
                  <div className="text-white">{formatDistance(selectedIncident.distance)}</div>
                </div>
                <div>
                  <span className="text-gray-400">Severity:</span>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    selectedIncident.severity === 'critical' ? 'bg-red-600 text-white' :
                    selectedIncident.severity === 'high' ? 'bg-orange-600 text-white' :
                    selectedIncident.severity === 'medium' ? 'bg-yellow-600 text-black' :
                    'bg-blue-600 text-white'
                  }`}>
                    {selectedIncident.severity.toUpperCase()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">ETA:</span>
                  <div className="text-white">~{selectedIncident.estimatedDuration}min</div>
                </div>
              </div>

              {currentRoute && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Navigation className="w-4 h-4 text-cyan-400" />
                    <span className="text-white font-medium">Route Information</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Distance:</span>
                      <div className="text-white">{formatDistance(currentRoute.distance)}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Duration:</span>
                      <div className="text-white">{formatDuration(currentRoute.duration)}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                {selectedIncident.assignedWorker === worker.id ? (
                  <>
                    <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Navigate
                    </button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Update Status
                    </button>
                  </>
                ) : (
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                    Accept Assignment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};