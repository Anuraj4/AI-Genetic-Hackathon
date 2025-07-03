import React from 'react';
import { MapPin, Clock, Radio, Navigation, CheckCircle } from 'lucide-react';
import { Resource, Incident } from '../types';

interface ResourceDispatchProps {
  resources: Resource[];
  incidents: Incident[];
  onDispatchResource: (resourceId: string, incidentId: string) => void;
}

export const ResourceDispatch: React.FC<ResourceDispatchProps> = ({ 
  resources, 
  incidents, 
  onDispatchResource 
}) => {
  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'medical': return '🚑';
      case 'security': return '👮';
      case 'fire': return '🚒';
      case 'police': return '🚔';
      default: return '🚨';
    }
  };

  const getStatusColor = (status: Resource['status']) => {
    switch (status) {
      case 'available': return 'bg-green-600';
      case 'dispatched': return 'bg-yellow-600';
      case 'responding': return 'bg-orange-600';
      case 'busy': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getIncidentSeverityColor = (severity: Incident['severity']) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-950';
      case 'high': return 'border-orange-500 bg-orange-950';
      case 'medium': return 'border-yellow-500 bg-yellow-950';
      case 'low': return 'border-blue-500 bg-blue-950';
      default: return 'border-gray-500 bg-gray-950';
    }
  };

  const activeIncidents = incidents.filter(i => i.status !== 'resolved');
  const availableResources = resources.filter(r => r.status === 'available');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Active Incidents */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Active Incidents</h3>
          <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            {activeIncidents.length}
          </span>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activeIncidents.map((incident) => (
            <div
              key={incident.id}
              className={`border-l-4 p-3 rounded-r-lg ${getIncidentSeverityColor(incident.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getResourceIcon(incident.type as Resource['type'])}</span>
                    <h4 className="font-medium text-white capitalize">{incident.type.replace('_', ' ')}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      incident.severity === 'critical' ? 'bg-red-600 text-white' :
                      incident.severity === 'high' ? 'bg-orange-600 text-white' :
                      incident.severity === 'medium' ? 'bg-yellow-600 text-black' :
                      'bg-blue-600 text-white'
                    }`}>
                      {incident.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-2">{incident.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{incident.reportedAt.toLocaleTimeString('en-US', { hour12: false })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{incident.location.zone}</span>
                    </div>
                  </div>
                  
                  {incident.assignedResources.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400">Assigned Resources:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {incident.assignedResources.map((resourceId) => {
                          const resource = resources.find(r => r.id === resourceId);
                          return resource ? (
                            <span key={resourceId} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                              {resource.callSign}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                {incident.assignedResources.length === 0 && (
                  <button
                    onClick={() => {
                      const nearestResource = availableResources.find(r => r.type === incident.type);
                      if (nearestResource) {
                        onDispatchResource(nearestResource.id, incident.id);
                      }
                    }}
                    className="ml-2 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded transition-colors"
                  >
                    Auto-Dispatch
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Status */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Resource Status</h3>
          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            {availableResources.length} Available
          </span>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getResourceIcon(resource.type)}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{resource.callSign}</span>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(resource.status)}`}></div>
                  </div>
                  <p className="text-sm text-gray-400 capitalize">{resource.type} Unit</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-white capitalize">{resource.status}</p>
                {resource.eta && (
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <Navigation className="w-3 h-3" />
                    <span>ETA: {resource.eta}m</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Quick Dispatch Panel */}
        <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-600">
          <h4 className="text-sm font-medium text-white mb-2">Quick Dispatch</h4>
          <div className="grid grid-cols-2 gap-2">
            {['medical', 'security', 'fire', 'police'].map((type) => {
              const availableCount = resources.filter(r => r.type === type && r.status === 'available').length;
              return (
                <button
                  key={type}
                  className="flex items-center justify-between p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                  disabled={availableCount === 0}
                >
                  <span className="flex items-center space-x-2">
                    <span>{getResourceIcon(type as Resource['type'])}</span>
                    <span className="text-white capitalize">{type}</span>
                  </span>
                  <span className="text-gray-400">{availableCount}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};