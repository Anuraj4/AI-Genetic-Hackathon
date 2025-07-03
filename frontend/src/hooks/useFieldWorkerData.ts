import { useState, useEffect, useCallback } from 'react';
import { Worker, FieldIncident, Notification, NavigationRoute } from '../types';

export const useFieldWorkerData = () => {
  const [worker, setWorker] = useState<Worker>({
    id: 'worker-001',
    name: 'Alex Rodriguez',
    callSign: 'MED-7',
    type: 'medical',
    status: 'available',
    position: { lat: 40.7128, lng: -74.0060 },
    radius: 500, // 500 meters
    expertise: ['First Aid', 'CPR', 'Emergency Response', 'Crowd Management'],
    shift: {
      start: '08:00',
      end: '20:00'
    },
    contact: {
      phone: '+1 (555) 123-4567',
      radio: 'Channel 7'
    }
  });

  const [incidents, setIncidents] = useState<FieldIncident[]>([
    {
      id: 'inc-001',
      type: 'medical',
      title: 'Person Collapsed - Heat Exhaustion',
      description: 'Individual collapsed near main stage barrier. Conscious but showing signs of heat exhaustion. Requires immediate medical attention.',
      location: {
        lat: 40.7130,
        lng: -74.0058,
        address: 'Main Stage North, Section A',
        zone: 'Main Stage North'
      },
      severity: 'high',
      priority: 1,
      reportedAt: new Date(Date.now() - 300000), // 5 minutes ago
      assignedWorker: 'worker-001',
      requiredExpertise: ['First Aid', 'Medical Emergency'],
      estimatedDuration: 15,
      status: 'assigned',
      reporter: {
        name: 'Security Team Alpha',
        contact: 'SEC-ALPHA',
        type: 'staff'
      },
      distance: 180
    },
    {
      id: 'inc-002',
      type: 'crowd_control',
      title: 'Crowd Bottleneck - Food Court',
      description: 'Large crowd buildup at food court entrance causing safety concerns. Need crowd management assistance.',
      location: {
        lat: 40.7125,
        lng: -74.0055,
        address: 'Food Court East Entrance',
        zone: 'Food Court East'
      },
      severity: 'medium',
      priority: 2,
      reportedAt: new Date(Date.now() - 180000), // 3 minutes ago
      requiredExpertise: ['Crowd Management'],
      estimatedDuration: 20,
      status: 'reported',
      reporter: {
        name: 'AI Monitoring System',
        contact: 'DRISHTI-AI',
        type: 'ai_system'
      },
      distance: 320
    },
    {
      id: 'inc-003',
      type: 'medical',
      title: 'Minor Injury - Cut Hand',
      description: 'Attendee has a minor cut on hand from broken glass. Needs basic first aid treatment.',
      location: {
        lat: 40.7132,
        lng: -74.0062,
        address: 'West Gate Area',
        zone: 'West Gate'
      },
      severity: 'low',
      priority: 3,
      reportedAt: new Date(Date.now() - 120000), // 2 minutes ago
      requiredExpertise: ['First Aid'],
      estimatedDuration: 10,
      status: 'reported',
      reporter: {
        name: 'John Smith',
        contact: '+1 (555) 987-6543',
        type: 'public'
      },
      distance: 450
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-001',
      type: 'incident_assigned',
      title: 'New Incident Assigned',
      message: 'You have been assigned to a medical emergency at Main Stage North. Person collapsed with heat exhaustion.',
      timestamp: new Date(Date.now() - 300000),
      read: false,
      priority: 'high',
      relatedIncident: 'inc-001',
      actionRequired: true
    },
    {
      id: 'notif-002',
      type: 'emergency_alert',
      title: 'Emergency Alert - Severe Weather',
      message: 'Severe thunderstorm warning issued for the area. All outdoor activities should be suspended immediately.',
      timestamp: new Date(Date.now() - 600000),
      read: false,
      priority: 'critical',
      actionRequired: true
    },
    {
      id: 'notif-003',
      type: 'system_message',
      title: 'Shift Update',
      message: 'Your shift has been extended by 2 hours due to increased incident volume.',
      timestamp: new Date(Date.now() - 900000),
      read: true,
      priority: 'medium',
      actionRequired: false
    }
  ]);

  const [currentRoute, setCurrentRoute] = useState<NavigationRoute | undefined>();

  // Calculate distances from worker to incidents
  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }, []);

  // Update incident distances when worker position changes
  useEffect(() => {
    setIncidents(prev => prev.map(incident => ({
      ...incident,
      distance: calculateDistance(
        worker.position.lat,
        worker.position.lng,
        incident.location.lat,
        incident.location.lng
      )
    })));
  }, [worker.position, calculateDistance]);

  const acceptIncident = useCallback((incidentId: string) => {
    setIncidents(prev => prev.map(incident =>
      incident.id === incidentId
        ? { ...incident, assignedWorker: worker.id, status: 'assigned' }
        : incident
    ));

    setWorker(prev => ({ ...prev, status: 'responding' }));

    // Add notification
    const incident = incidents.find(i => i.id === incidentId);
    if (incident) {
      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        type: 'incident_assigned',
        title: 'Incident Accepted',
        message: `You have accepted assignment for: ${incident.title}`,
        timestamp: new Date(),
        read: false,
        priority: 'medium',
        relatedIncident: incidentId,
        actionRequired: true
      };
      setNotifications(prev => [newNotification, ...prev]);
    }

    // Generate mock route
    setCurrentRoute({
      distance: incident?.distance || 0,
      duration: Math.ceil((incident?.distance || 0) / 50), // Assume 50m/min walking speed
      steps: [
        {
          instruction: 'Head north on Main Street',
          distance: 150,
          duration: 3,
          coordinates: { lat: worker.position.lat + 0.001, lng: worker.position.lng }
        },
        {
          instruction: 'Turn right at the food court',
          distance: 100,
          duration: 2,
          coordinates: { lat: worker.position.lat + 0.001, lng: worker.position.lng + 0.001 }
        }
      ],
      polyline: 'mock_polyline_data'
    });
  }, [worker.id, worker.position, incidents]);

  const updateWorkerStatus = useCallback((status: Worker['status']) => {
    setWorker(prev => ({ ...prev, status }));
  }, []);

  const updateWorkerLocation = useCallback((position: { lat: number; lng: number }) => {
    setWorker(prev => ({ ...prev, position }));
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Occasionally add new incidents
      if (Math.random() < 0.1) {
        const newIncident: FieldIncident = {
          id: `inc-${Date.now()}`,
          type: ['medical', 'security', 'maintenance'][Math.floor(Math.random() * 3)] as FieldIncident['type'],
          title: 'New Incident Detected',
          description: 'AI system has detected a new incident requiring attention.',
          location: {
            lat: 40.7128 + (Math.random() - 0.5) * 0.01,
            lng: -74.0060 + (Math.random() - 0.5) * 0.01,
            address: 'Auto-detected location',
            zone: ['Main Stage North', 'Food Court East', 'West Gate'][Math.floor(Math.random() * 3)]
          },
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as FieldIncident['severity'],
          priority: Math.floor(Math.random() * 3) + 1,
          reportedAt: new Date(),
          requiredExpertise: ['First Aid'],
          estimatedDuration: Math.floor(Math.random() * 30) + 10,
          status: 'reported',
          reporter: {
            name: 'AI Monitoring System',
            contact: 'DRISHTI-AI',
            type: 'ai_system'
          }
        };

        setIncidents(prev => [newIncident, ...prev.slice(0, 9)]);

        // Add notification for new incident
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          type: 'incident_update',
          title: 'New Incident in Your Area',
          message: `${newIncident.title} - ${newIncident.location.zone}`,
          timestamp: new Date(),
          read: false,
          priority: newIncident.severity === 'high' ? 'high' : 'medium',
          relatedIncident: newIncident.id,
          actionRequired: false
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 19)]);
      }
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    worker,
    incidents,
    notifications,
    currentRoute,
    acceptIncident,
    updateWorkerStatus,
    updateWorkerLocation,
    markNotificationRead
  };
};