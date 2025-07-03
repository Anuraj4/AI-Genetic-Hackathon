import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, Clock, Target } from 'lucide-react';
import { CrowdMetrics } from '../types';

interface CrowdAnalyticsProps {
  metrics: CrowdMetrics;
}

export const CrowdAnalytics: React.FC<CrowdAnalyticsProps> = ({ metrics }) => {
  // Mock time series data for demonstration
  const crowdFlowData = [
    { time: '10:00', north: 1200, south: 800, east: 950, west: 1100 },
    { time: '11:00', north: 1450, south: 920, east: 1200, west: 1250 },
    { time: '12:00', north: 1800, south: 1100, east: 1500, west: 1600 },
    { time: '13:00', north: 2200, south: 1400, east: 1800, west: 1900 },
    { time: '14:00', north: 2500, south: 1600, east: 2100, west: 2200 },
    { time: '15:00', north: 2800, south: 1800, east: 2400, west: 2500 },
  ];

  const densityData = Object.entries(metrics.densityByZone).map(([zone, density]) => ({
    zone,
    density: Math.round(density * 100),
    risk: density > 0.8 ? 'high' : density > 0.6 ? 'medium' : 'low'
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-600 p-2 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Attendees</p>
              <p className="text-2xl font-bold text-white">{metrics.totalAttendees.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-600 p-2 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Predicted Bottlenecks</p>
              <p className="text-2xl font-bold text-white">{metrics.predictedBottlenecks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Movement Patterns</p>
              <p className="text-2xl font-bold text-white">{metrics.movementPatterns.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg. ETA to Bottleneck</p>
              <p className="text-2xl font-bold text-white">
                {Math.min(...metrics.predictedBottlenecks.map(b => b.estimatedTime))} min
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crowd Flow Over Time */}
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Crowd Flow by Zone</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={crowdFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Area type="monotone" dataKey="north" stackId="1" stroke="#00D9FF" fill="#00D9FF" fillOpacity={0.3} />
              <Area type="monotone" dataKey="south" stackId="1" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.3} />
              <Area type="monotone" dataKey="east" stackId="1" stroke="#00FF88" fill="#00FF88" fillOpacity={0.3} />
              <Area type="monotone" dataKey="west" stackId="1" stroke="#FFFF00" fill="#FFFF00" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Zone Density */}
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Current Zone Density</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={densityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="zone" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Bar dataKey="density" fill={(entry: any) => {
                const risk = entry?.risk;
                return risk === 'high' ? '#FF4444' : risk === 'medium' ? '#FF6B35' : '#00FF88';
              }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Predicted Bottlenecks */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Predicted Bottlenecks (Next 20 Minutes)</h3>
        <div className="space-y-3">
          {metrics.predictedBottlenecks.map((bottleneck, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  bottleneck.probability > 0.8 ? 'bg-red-500' :
                  bottleneck.probability > 0.6 ? 'bg-orange-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="font-medium text-white">{bottleneck.zone}</p>
                  <p className="text-sm text-gray-400">
                    {Math.round(bottleneck.probability * 100)}% probability in {bottleneck.estimatedTime} minutes
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-cyan-400 font-medium">
                  ETA: {bottleneck.estimatedTime}m
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};