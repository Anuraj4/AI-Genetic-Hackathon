import { useState, useEffect } from 'react';
import { Alert, Zone, Resource, Incident, CrowdMetrics } from '../types';

export const useEventData = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'critical',
      title: 'High Density Alert - Main Stage North',
      description: 'Crowd density exceeding safe limits. Immediate intervention required.',
      timestamp: new Date(Date.now() - 300000),
      zone: 'Main Stage North',
      priority: 1,
      resolved: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Potential Bottleneck Detected',
      description: 'AI predicts congestion at Food Court East in 8 minutes',
      timestamp: new Date(Date.now() - 180000),
      zone: 'Food Court East',
      priority: 2,
      resolved: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Lost Person Report',
      description: 'Missing child reported near West Gate. Search initiated.',
      timestamp: new Date(Date.now() - 120000),
      zone: 'West Gate',
      priority: 3,
      resolved: false
    }
  ]);

  const [zones] = useState<Zone[]>([
    {
      id: 'main-north',
      name: 'Main Stage North',
      capacity: 15000,
      currentOccupancy: 13500,
      riskLevel: 'critical',
      cameras: [
        { id: 'cam-1', name: 'North-1', position: { x: 0, y: 0 }, status: 'online' },
        { id: 'cam-2', name: 'North-2', position: { x: 100, y: 0 }, status: 'online' }
      ],
      lastUpdate: new Date()
    },
    {
      id: 'main-south',
      name: 'Main Stage South',
      capacity: 12000,
      currentOccupancy: 9200,
      riskLevel: 'high',
      cameras: [
        { id: 'cam-3', name: 'South-1', position: { x: 0, y: 100 }, status: 'online' }
      ],
      lastUpdate: new Date()
    },
    {
      id: 'food-east',
      name: 'Food Court East',
      capacity: 8000,
      currentOccupancy: 4800,
      riskLevel: 'medium',
      cameras: [
        { id: 'cam-4', name: 'East-1', position: { x: 200, y: 50 }, status: 'online' }
      ],
      lastUpdate: new Date()
    },
    {
      id: 'west-gate',
      name: 'West Gate',
      capacity: 5000,
      currentOccupancy: 1200,
      riskLevel: 'low',
      cameras: [
        { id: 'cam-5', name: 'Gate-1', position: { x: -100, y: 50 }, status: 'online' }
      ],
      lastUpdate: new Date()
    }
  ]);

  const [resources, setResources] = useState<Resource[]>([
    {
      id: 'med-1',
      type: 'medical',
      callSign: 'MED-1',
      position: { lat: 40.7128, lng: -74.0060 },
      status: 'available'
    },
    {
      id: 'sec-1',
      type: 'security',
      callSign: 'SEC-ALPHA',
      position: { lat: 40.7130, lng: -74.0058 },
      status: 'available'
    },
    {
      id: 'fire-1',
      type: 'fire',
      callSign: 'FIRE-1',
      position: { lat: 40.7125, lng: -74.0062 },
      status: 'responding',
      eta: 4
    }
  ]);

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'inc-1',
      type: 'medical',
      location: { lat: 40.7129, lng: -74.0059, zone: 'Main Stage North' },
      severity: 'high',
      description: 'Person collapsed near barrier, possible heat exhaustion',
      reportedAt: new Date(Date.now() - 600000),
      assignedResources: ['med-1'],
      status: 'responding'
    },
    {
      id: 'inc-2',
      type: 'crowd_control',
      location: { lat: 40.7131, lng: -74.0057, zone: 'Food Court East' },
      severity: 'medium',
      description: 'Crowd buildup causing bottleneck at entrance',
      reportedAt: new Date(Date.now() - 300000),
      assignedResources: [],
      status: 'reported'
    }
  ]);

  const [crowdMetrics] = useState<CrowdMetrics>({
    totalAttendees: 45000,
    densityByZone: {
      'Main Stage North': 0.9,
      'Main Stage South': 0.77,
      'Food Court East': 0.6,
      'West Gate': 0.24
    },
    movementPatterns: [
      { from: 'West Gate', to: 'Main Stage North', volume: 1200, trend: 'increasing' },
      { from: 'Food Court East', to: 'Main Stage South', volume: 800, trend: 'stable' },
      { from: 'Main Stage North', to: 'Food Court East', volume: 600, trend: 'decreasing' }
    ],
    predictedBottlenecks: [
      { zone: 'Main Stage South', probability: 0.78, estimatedTime: 12 },
      { zone: 'Food Court East', probability: 0.65, estimatedTime: 8 },
      { zone: 'West Gate', probability: 0.45, estimatedTime: 18 }
    ]
  });

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const dispatchResource = (resourceId: string, incidentId: string) => {
    setResources(prev => prev.map(resource =>
      resource.id === resourceId 
        ? { ...resource, status: 'dispatched', eta: Math.floor(Math.random() * 10) + 2 }
        : resource
    ));
    
    setIncidents(prev => prev.map(incident =>
      incident.id === incidentId
        ? { ...incident, assignedResources: [...incident.assignedResources, resourceId], status: 'dispatched' }
        : incident
    ));
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add random alerts occasionally
      if (Math.random() < 0.1) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: Math.random() < 0.3 ? 'critical' : Math.random() < 0.6 ? 'warning' : 'info',
          title: 'AI Anomaly Detected',
          description: 'Unusual activity detected in surveillance feed',
          timestamp: new Date(),
          zone: zones[Math.floor(Math.random() * zones.length)].name,
          priority: Math.floor(Math.random() * 3) + 1,
          resolved: false
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [zones]);

  return {
    alerts,
    zones,
    resources,
    incidents,
    crowdMetrics,
    resolveAlert,
    dispatchResource
  };
};