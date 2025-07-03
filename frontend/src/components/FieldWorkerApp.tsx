import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { FieldWorkerHeader } from './FieldWorkerHeader';
import { IncidentMap } from './IncidentMap';
import { IncidentList } from './IncidentList';
import { WorkerProfile } from './WorkerProfile';
import { NotificationPanel } from './NotificationPanel';
import { useFieldWorkerData } from '../hooks/useFieldWorkerData';

export const FieldWorkerApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('incidents');
  const {
    worker,
    incidents,
    notifications,
    currentRoute,
    acceptIncident,
    updateWorkerStatus,
    markNotificationRead,
    updateWorkerLocation
  } = useFieldWorkerData();

  // Simulate GPS location updates
  useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateWorkerLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('GPS location unavailable:', error);
        }
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [updateWorkerLocation]);

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const activeIncidents = incidents.filter(i => 
    i.status === 'assigned' || i.status === 'responding' || i.status === 'on_scene'
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <FieldWorkerHeader 
        worker={worker}
        unreadNotifications={unreadNotifications}
        onStatusChange={updateWorkerStatus}
      />
      
      <main className="pb-20">
        <Routes>
          <Route path="/" element={
            <div className="p-4 space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-cyan-400">{activeIncidents.length}</div>
                  <div className="text-sm text-gray-400">Active Incidents</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-orange-400">{unreadNotifications}</div>
                  <div className="text-sm text-gray-400">New Alerts</div>
                </div>
              </div>

              {/* Current Assignment */}
              {activeIncidents.length > 0 && (
                <div className="bg-red-950 border border-red-500 rounded-lg p-4">
                  <h3 className="font-semibold text-red-300 mb-2">Current Assignment</h3>
                  <div className="space-y-2">
                    {activeIncidents.map(incident => (
                      <div key={incident.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{incident.title}</div>
                          <div className="text-sm text-gray-300">{incident.location.zone}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-cyan-400">
                            {incident.distance ? `${Math.round(incident.distance)}m` : 'Calculating...'}
                          </div>
                          <div className="text-xs text-gray-400 capitalize">{incident.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <IncidentList 
                incidents={incidents} 
                workerId={worker.id}
                onAcceptIncident={acceptIncident}
              />
            </div>
          } />
          <Route path="/map" element={
            <IncidentMap 
              worker={worker}
              incidents={incidents}
              currentRoute={currentRoute}
            />
          } />
          <Route path="/notifications" element={
            <NotificationPanel 
              notifications={notifications}
              onMarkRead={markNotificationRead}
            />
          } />
          <Route path="/profile" element={
            <WorkerProfile 
              worker={worker}
              onStatusChange={updateWorkerStatus}
            />
          } />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => setActiveTab('incidents')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'incidents' ? 'text-cyan-400' : 'text-gray-400'
            }`}
          >
            <div className="w-6 h-6">📋</div>
            <span className="text-xs">Incidents</span>
          </button>
          
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'map' ? 'text-cyan-400' : 'text-gray-400'
            }`}
          >
            <div className="w-6 h-6">🗺️</div>
            <span className="text-xs">Map</span>
          </button>
          
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex flex-col items-center justify-center space-y-1 relative ${
              activeTab === 'notifications' ? 'text-cyan-400' : 'text-gray-400'
            }`}
          >
            <div className="w-6 h-6">🔔</div>
            <span className="text-xs">Alerts</span>
            {unreadNotifications > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotifications}
              </div>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'profile' ? 'text-cyan-400' : 'text-gray-400'
            }`}
          >
            <div className="w-6 h-6">👤</div>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};