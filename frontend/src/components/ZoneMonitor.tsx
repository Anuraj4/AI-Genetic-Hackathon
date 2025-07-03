import React from 'react';
import { Users, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { Zone } from '../types';

interface ZoneMonitorProps {
  zones: Zone[];
}

export const ZoneMonitor: React.FC<ZoneMonitorProps> = ({ zones }) => {
  const getRiskColor = (riskLevel: Zone['riskLevel']) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getOccupancyPercentage = (zone: Zone) => {
    return Math.round((zone.currentOccupancy / zone.capacity) * 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {zones.map((zone) => {
        const occupancyPercent = getOccupancyPercentage(zone);
        const isOverCapacity = zone.currentOccupancy > zone.capacity;
        
        return (
          <div
            key={zone.id}
            className={`bg-gray-900 rounded-lg border border-gray-700 p-4 transition-all duration-300 ${
              zone.riskLevel === 'critical' ? 'border-red-500 shadow-red-500/20 shadow-lg' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{zone.name}</h3>
              <div className={`w-3 h-3 rounded-full ${getRiskColor(zone.riskLevel)} animate-pulse`}></div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-gray-300">Occupancy</span>
                </div>
                <span className={`text-sm font-medium ${isOverCapacity ? 'text-red-400' : 'text-white'}`}>
                  {zone.currentOccupancy.toLocaleString()} / {zone.capacity.toLocaleString()}
                </span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    occupancyPercent > 90 ? 'bg-red-500' :
                    occupancyPercent > 75 ? 'bg-orange-500' :
                    occupancyPercent > 50 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{occupancyPercent}% capacity</span>
                <span>Risk: {zone.riskLevel.toUpperCase()}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="flex items-center space-x-2">
                  <Shield className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-gray-300">
                    {zone.cameras.filter(c => c.status === 'online').length} Cameras
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-gray-300">AI Active</span>
                </div>
              </div>
              
              {zone.riskLevel === 'critical' && (
                <div className="mt-3 p-2 bg-red-950 border border-red-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-300 font-medium">
                      Critical density detected - immediate attention required
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};