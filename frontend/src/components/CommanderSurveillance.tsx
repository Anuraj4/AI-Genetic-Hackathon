import React, { useState } from 'react';
import { Eye, Shield, Users, AlertTriangle, Camera, Monitor, Zap, Target } from 'lucide-react';
import { AlertPanel } from './AlertPanel';
import { ZoneMonitor } from './ZoneMonitor';
import { CrowdAnalytics } from './CrowdAnalytics';
import { CommandInterface } from './CommandInterface';
import { ResourceDispatch } from './ResourceDispatch';
import { Alert, Zone, Resource, Incident, CrowdMetrics } from '../types';

interface CommanderSurveillanceProps {
  alerts: Alert[];
  zones: Zone[];
  resources: Resource[];
  incidents: Incident[];
  crowdMetrics: CrowdMetrics;
  onResolveAlert: (alertId: string) => void;
  onDispatchResource: (resourceId: string, incidentId: string) => void;
  onCommand: (command: string) => void;
}

export const CommanderSurveillance: React.FC<CommanderSurveillanceProps> = ({
  alerts,
  zones,
  resources,
  incidents,
  crowdMetrics,
  onResolveAlert,
  onDispatchResource,
  onCommand
}) => {
  const [activeView, setActiveView] = useState('surveillance');

  const views = [
    { id: 'surveillance', label: 'Live Surveillance', icon: Camera },
    { id: 'overview', label: 'Tactical Overview', icon: Eye },
    { id: 'crowd', label: 'Crowd Analytics', icon: Users },
    { id: 'incidents', label: 'Incident Command', icon: AlertTriangle },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'surveillance':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              {/* Main Camera Grid */}
              <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Camera className="w-5 h-5 text-cyan-400" />
                    <span>Live Camera Feeds - AI Enhanced</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">All Systems Online</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: 1, zone: 'Main Stage North', threat: 'high', crowd: 'dense', people: 450 },
                    { id: 2, zone: 'Food Court East', threat: 'medium', crowd: 'moderate', people: 280 },
                    { id: 3, zone: 'West Gate', threat: 'low', crowd: 'light', people: 120 },
                    { id: 4, zone: 'Main Stage South', threat: 'high', crowd: 'dense', people: 380 },
                    { id: 5, zone: 'Emergency Exit A', threat: 'medium', crowd: 'moderate', people: 190 },
                    { id: 6, zone: 'VIP Section', threat: 'low', crowd: 'light', people: 85 }
                  ].map((feed) => (
                    <div key={feed.id} className="aspect-video bg-gray-800 rounded-lg relative overflow-hidden border border-gray-600 hover:border-cyan-500 transition-colors cursor-pointer group">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900"></div>
                      
                      {/* Live Indicator */}
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                        LIVE
                      </div>
                      
                      {/* AI Analysis Overlay */}
                      <div className="absolute top-2 right-2 bg-cyan-600 text-white px-2 py-1 rounded text-xs font-bold">
                        AI
                      </div>
                      
                      {/* Threat Level */}
                      <div className={`absolute top-8 right-2 px-2 py-1 rounded text-xs font-bold ${
                        feed.threat === 'high' ? 'bg-red-600 text-white' :
                        feed.threat === 'medium' ? 'bg-orange-600 text-white' :
                        'bg-green-600 text-white'
                      }`}>
                        {feed.threat.toUpperCase()}
                      </div>
                      
                      {/* Camera Info */}
                      <div className="absolute bottom-2 left-2 text-white text-sm">
                        <div className="font-medium">Camera {feed.id}</div>
                        <div className="text-xs text-gray-300">{feed.zone}</div>
                      </div>
                      
                      {/* Crowd Density */}
                      <div className="absolute bottom-2 right-2 text-white text-xs">
                        <div className={`px-2 py-1 rounded ${
                          feed.crowd === 'dense' ? 'bg-red-600' :
                          feed.crowd === 'moderate' ? 'bg-orange-600' :
                          'bg-green-600'
                        }`}>
                          {feed.people} PPL
                        </div>
                      </div>
                      
                      {/* Mock Video Content */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                            <span className="text-2xl">📹</span>
                          </div>
                          <p className="text-sm">AI Analysis Active</p>
                          <div className="mt-2 text-xs">
                            <div>Crowd: {feed.people} people</div>
                            <div>Flow: {['Normal', 'Congested', 'Blocked'][Math.floor(Math.random() * 3)]}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* AI Detection Overlays */}
                      {feed.threat === 'high' && (
                        <div className="absolute inset-0 border-2 border-red-500 animate-pulse"></div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                          View Full Screen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Analytics Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <h4 className="font-semibold text-white">AI Detections</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Anomalies:</span>
                      <span className="text-red-400 font-bold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Crowd Surges:</span>
                      <span className="text-orange-400 font-bold">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Normal:</span>
                      <span className="text-green-400 font-bold">95%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <h4 className="font-semibold text-white">Predictions</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Bottleneck Risk:</span>
                      <span className="text-orange-400 font-bold">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">ETA Critical:</span>
                      <span className="text-red-400 font-bold">12 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Confidence:</span>
                      <span className="text-cyan-400 font-bold">94%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Monitor className="w-5 h-5 text-green-400" />
                    <h4 className="font-semibold text-white">System Health</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Cameras:</span>
                      <span className="text-green-400 font-bold">47/47</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">AI Processing:</span>
                      <span className="text-green-400 font-bold">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Latency:</span>
                      <span className="text-green-400 font-bold">12ms</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Users className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold text-white">Live Stats</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total People:</span>
                      <span className="text-blue-400 font-bold">1,505</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Avg Density:</span>
                      <span className="text-blue-400 font-bold">68%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Flow Rate:</span>
                      <span className="text-blue-400 font-bold">Normal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <AlertPanel alerts={alerts} onResolveAlert={onResolveAlert} />
              <CommandInterface onCommand={onCommand} />
            </div>
          </div>
        );
        
      case 'crowd':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              <CrowdAnalytics metrics={crowdMetrics} />
            </div>
            <div className="space-y-6">
              <AlertPanel alerts={alerts} onResolveAlert={onResolveAlert} />
              <CommandInterface onCommand={onCommand} />
            </div>
          </div>
        );
        
      case 'incidents':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              <ResourceDispatch 
                resources={resources} 
                incidents={incidents} 
                onDispatchResource={onDispatchResource} 
              />
            </div>
            <div className="space-y-6">
              <AlertPanel alerts={alerts} onResolveAlert={onResolveAlert} />
              <CommandInterface onCommand={onCommand} />
            </div>
          </div>
        );
        
      default: // Tactical Overview
        return (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              <ZoneMonitor zones={zones} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResourceDispatch 
                  resources={resources} 
                  incidents={incidents} 
                  onDispatchResource={onDispatchResource} 
                />
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-cyan-400" />
                    <span>Tactical Summary</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-2xl font-bold text-cyan-400">{crowdMetrics.totalAttendees.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">Total Attendees</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-2xl font-bold text-orange-400">{alerts.filter(a => !a.resolved).length}</div>
                        <div className="text-sm text-gray-400">Active Alerts</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-2xl font-bold text-green-400">{resources.filter(r => r.status === 'available').length}</div>
                        <div className="text-sm text-gray-400">Available Units</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-2xl font-bold text-red-400">{incidents.filter(i => i.status !== 'resolved').length}</div>
                        <div className="text-sm text-gray-400">Active Incidents</div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-lg font-bold text-yellow-400 mb-2">Risk Assessment</div>
                      <div className="space-y-2">
                        {zones.map(zone => (
                          <div key={zone.id} className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">{zone.name}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              zone.riskLevel === 'critical' ? 'bg-red-600 text-white' :
                              zone.riskLevel === 'high' ? 'bg-orange-600 text-white' :
                              zone.riskLevel === 'medium' ? 'bg-yellow-600 text-black' :
                              'bg-green-600 text-white'
                            }`}>
                              {zone.riskLevel.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <AlertPanel alerts={alerts} onResolveAlert={onResolveAlert} />
              <CommandInterface onCommand={onCommand} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Commander Header with Tabbed Navigation */}
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="text-cyan-400 w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold text-white">Project Drishti</h1>
                <p className="text-sm text-gray-400">AI-Powered Event Safety Platform - Commander Interface</p>
              </div>
            </div>
          </div>
          
          <nav className="flex space-x-1">
            {views.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeView === id
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">System Status</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        {renderContent()}
      </main>
    </div>
  );
};