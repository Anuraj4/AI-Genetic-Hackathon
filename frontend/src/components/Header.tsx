import React from 'react';
import { Eye, Shield, Users, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  const views = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'surveillance', label: 'Surveillance', icon: Shield },
    { id: 'crowd', label: 'Crowd Analytics', icon: Users },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
  ];

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Eye className="text-cyan-400 w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold text-white">Project Drishti</h1>
              <p className="text-sm text-gray-400">AI-Powered Event Safety Platform</p>
            </div>
          </div>
        </div>
        
        <nav className="flex space-x-1">
          {views.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
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
  );
};