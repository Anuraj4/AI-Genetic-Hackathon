import React, { useState } from "react";
import { Eye, Shield, Users, AlertTriangle, Menu, X } from "lucide-react";

interface HeaderProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const views = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "surveillance", label: "Surveillance", icon: Shield },
    { id: "crowd", label: "Crowd Analytics", icon: Users },
    { id: "incidents", label: "Incidents", icon: AlertTriangle },
  ];

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left logo section */}
        <div className="flex items-center space-x-2">
          <Eye className="text-cyan-400 w-8 h-8" />
          <div className="max-[400px]:text-sm">
            <h1 className="text-2xl max-[400px]:text-lg font-bold text-white">
              Project Drishti
            </h1>
            <p className="text-sm max-[400px]:text-xs text-gray-400">
              AI-Powered Event Safety Platform
            </p>
          </div>
        </div>

        {/* Hamburger icon for mobile */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            {menuOpen ? (
              <X className="w-6 h-6 transition-transform duration-300" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Main navigation (desktop) */}
        <nav className="hidden md:flex space-x-1">
          {views.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === id
                  ? "bg-cyan-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* System status */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">System Status</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="mt-4 md:hidden space-y-2">
          {views.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                onViewChange(id);
                setMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === id
                  ? "bg-cyan-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </button>
          ))}

          {/* System status (visible in mobile view) */}
          <div className="border-t border-gray-700 pt-3 text-sm">
            <div className="text-gray-400">System Status</div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Operational</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
