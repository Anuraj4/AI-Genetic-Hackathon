import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { AlertPanel } from './components/AlertPanel';
import { ZoneMonitor } from './components/ZoneMonitor';
import { CrowdAnalytics } from './components/CrowdAnalytics';
import { CommandInterface } from './components/CommandInterface';
import { ResourceDispatch } from './components/ResourceDispatch';
import { FieldWorkerApp } from './components/FieldWorkerApp';
import { CommanderSurveillance } from './components/CommanderSurveillance';
import { FindPersonApp } from './components/FindPersonApp';
import { useEventData } from './hooks/useEventData';

function App() {
  const [activeView, setActiveView] = useState('overview');
  const location = useLocation();
  const isFieldWorkerRoute = location.pathname.startsWith('/worker');
  const isCommanderRoute = location.pathname.startsWith('/surveillance');
  const isFindPersonRoute = location.pathname.startsWith('/findperson');
  
  const {
    alerts,
    zones,
    resources,
    incidents,
    crowdMetrics,
    resolveAlert,
    dispatchResource
  } = useEventData();

  const handleCommand = (command: string) => {
    console.log('Command received:', command);
    // In a real implementation, this would send the command to the AI system
  };

  const renderContent = () => {
    switch (activeView) {
      case 'surveillance':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Live Camera Feeds</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((feed) => (
                    <div key={feed} className="aspect-video bg-gray-800 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900"></div>
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                        LIVE
                      </div>
                      <div className="absolute bottom-2 left-2 text-white text-sm">
                        Camera {feed} - Zone {String.fromCharCode(64 + feed)}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                            <span className="text-2xl">📹</span>
                          </div>
                          <p className="text-sm">AI Analysis Active</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <ZoneMonitor zones={zones} />
            </div>
            <div>
              <AlertPanel alerts={alerts} onResolveAlert={resolveAlert} />
            </div>
          </div>
        );
        
      case 'crowd':
        return <CrowdAnalytics metrics={crowdMetrics} />;
        
      case 'incidents':
        return <ResourceDispatch 
          resources={resources} 
          incidents={incidents} 
          onDispatchResource={dispatchResource} 
        />;
        
      default:
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <ZoneMonitor zones={zones} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResourceDispatch 
                  resources={resources} 
                  incidents={incidents} 
                  onDispatchResource={dispatchResource} 
                />
              </div>
            </div>
            <div className="space-y-6">
              <AlertPanel alerts={alerts} onResolveAlert={resolveAlert} />
              <CommandInterface onCommand={handleCommand} />
            </div>
          </div>
        );
    }
  };

  // Field Worker Route
  if (isFieldWorkerRoute) {
    return (
      <Routes>
        <Route path="/worker/*" element={<FieldWorkerApp />} />
      </Routes>
    );
  }

  // Commander Surveillance Route
  if (isCommanderRoute) {
    return (
      <Routes>
        <Route path="/surveillance/*" element={
          <CommanderSurveillance 
            alerts={alerts}
            zones={zones}
            resources={resources}
            incidents={incidents}
            crowdMetrics={crowdMetrics}
            onResolveAlert={resolveAlert}
            onDispatchResource={dispatchResource}
            onCommand={handleCommand}
          />
        } />
      </Routes>
    );
  }

  // Find Person Route (Public Interface)
  if (isFindPersonRoute) {
    return (
      <Routes>
        <Route path="/findperson/*" element={<FindPersonApp />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header activeView={activeView} onViewChange={setActiveView} />
      <main className="p-6">
        <Routes>
          <Route path="/" element={renderContent()} />
        </Routes>
      </main>
    </div>
  );
}

export default App;