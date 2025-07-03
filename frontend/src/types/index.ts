export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: Date;
  zone: string;
  priority: number;
  resolved: boolean;
}

export interface Zone {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  cameras: Camera[];
  lastUpdate: Date;
}

export interface Camera {
  id: string;
  name: string;
  position: { x: number; y: number };
  status: 'online' | 'offline' | 'maintenance';
  aiAnalysis?: {
    crowdDensity: number;
    movement: 'normal' | 'congested' | 'panic';
    anomalies: string[];
  };
}

export interface Resource {
  id: string;
  type: 'security' | 'medical' | 'fire' | 'police';
  callSign: string;
  position: { lat: number; lng: number };
  status: 'available' | 'dispatched' | 'responding' | 'busy';
  eta?: number;
}

export interface Incident {
  id: string;
  type: 'medical' | 'security' | 'fire' | 'crowd_control';
  location: { lat: number; lng: number; zone: string };
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  reportedAt: Date;
  assignedResources: string[];
  status: 'reported' | 'dispatched' | 'on_scene' | 'resolved';
}

export interface CrowdMetrics {
  totalAttendees: number;
  densityByZone: Record<string, number>;
  movementPatterns: Array<{
    from: string;
    to: string;
    volume: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
  predictedBottlenecks: Array<{
    zone: string;
    probability: number;
    estimatedTime: number;
  }>;
}

// Field Worker Types
export interface Worker {
  id: string;
  name: string;
  callSign: string;
  type: 'medical' | 'security' | 'fire' | 'police' | 'maintenance';
  status: 'available' | 'responding' | 'on_scene' | 'busy' | 'off_duty';
  position: { lat: number; lng: number };
  radius: number; // in meters
  expertise: string[];
  shift: {
    start: string;
    end: string;
  };
  contact: {
    phone: string;
    radio: string;
  };
}

export interface FieldIncident {
  id: string;
  type: 'medical' | 'security' | 'fire' | 'crowd_control' | 'maintenance';
  title: string;
  description: string;
  location: { 
    lat: number; 
    lng: number; 
    address: string;
    zone: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  priority: number;
  reportedAt: Date;
  assignedWorker?: string;
  requiredExpertise: string[];
  estimatedDuration: number; // in minutes
  status: 'reported' | 'assigned' | 'responding' | 'on_scene' | 'resolved';
  reporter: {
    name: string;
    contact: string;
    type: 'public' | 'staff' | 'ai_system';
  };
  distance?: number; // distance from worker in meters
}

export interface NavigationRoute {
  distance: number; // in meters
  duration: number; // in minutes
  steps: Array<{
    instruction: string;
    distance: number;
    duration: number;
    coordinates: { lat: number; lng: number };
  }>;
  polyline: string;
}

export interface Notification {
  id: string;
  type: 'incident_assigned' | 'incident_update' | 'emergency_alert' | 'system_message';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  relatedIncident?: string;
  actionRequired?: boolean;
}