import React from 'react';
import { User, MapPin, Clock, Phone, Radio, Shield, Settings } from 'lucide-react';
import { Worker } from '../types';

interface WorkerProfileProps {
  worker: Worker;
  onStatusChange: (status: Worker['status']) => void;
}

export const WorkerProfile: React.FC<WorkerProfileProps> = ({
  worker,
  onStatusChange
}) => {
  const getStatusColor = (status: Worker['status']) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'responding': return 'bg-orange-500';
      case 'on_scene': return 'bg-blue-500';
      case 'busy': return 'bg-red-500';
      case 'off_duty': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getWorkerIcon = (type: Worker['type']) => {
    switch (type) {
      case 'medical': return '🚑';
      case 'security': return '👮';
      case 'fire': return '🚒';
      case 'police': return '🚔';
      case 'maintenance': return '🔧';
      default: return '👤';
    }
  };

  const formatShiftTime = (time: string) => {
    return new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-3xl">
            {getWorkerIcon(worker.type)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{worker.name}</h2>
            <p className="text-gray-400">{worker.callSign}</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(worker.status)}`}></div>
              <span className="text-sm text-gray-300 capitalize">{worker.status.replace('_', ' ')}</span>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-lg font-bold text-cyan-400">{worker.radius}m</div>
            <div className="text-xs text-gray-400">Response Radius</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-lg font-bold text-green-400">{worker.expertise.length}</div>
            <div className="text-xs text-gray-400">Specializations</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-lg font-bold text-orange-400">8h</div>
            <div className="text-xs text-gray-400">Shift Duration</div>
          </div>
        </div>
      </div>

      {/* Status Control */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span>Status Control</span>
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Status</label>
            <select
              value={worker.status}
              onChange={(e) => onStatusChange(e.target.value as Worker['status'])}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="available">Available</option>
              <option value="responding">Responding</option>
              <option value="on_scene">On Scene</option>
              <option value="busy">Busy</option>
              <option value="off_duty">Off Duty</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
              Check In
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
              Emergency
            </button>
          </div>
        </div>
      </div>

      {/* Worker Details */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
          <User className="w-5 h-5 text-cyan-400" />
          <span>Details</span>
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Department</label>
              <div className="text-white capitalize">{worker.type}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Call Sign</label>
              <div className="text-white">{worker.callSign}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Specializations</label>
            <div className="flex flex-wrap gap-2">
              {worker.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Shift Start</label>
              <div className="text-white">{formatShiftTime(worker.shift.start)}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Shift End</label>
              <div className="text-white">{formatShiftTime(worker.shift.end)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
          <Phone className="w-5 h-5 text-cyan-400" />
          <span>Contact</span>
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-white font-medium">Phone</div>
                <div className="text-sm text-gray-400">{worker.contact.phone}</div>
              </div>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm transition-colors">
              Call
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Radio className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-white font-medium">Radio</div>
                <div className="text-sm text-gray-400">{worker.contact.radio}</div>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm transition-colors">
              Radio
            </button>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <span>Current Location</span>
        </h3>
        
        <div className="space-y-3">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Latitude:</span>
                <div className="text-white font-mono">{worker.position.lat.toFixed(6)}</div>
              </div>
              <div>
                <span className="text-gray-400">Longitude:</span>
                <div className="text-white font-mono">{worker.position.lng.toFixed(6)}</div>
              </div>
            </div>
          </div>
          
          <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
            Update Location
          </button>
        </div>
      </div>
    </div>
  );
};