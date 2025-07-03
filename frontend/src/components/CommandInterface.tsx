import React, { useState } from 'react';
import { Send, Mic, Bot, User } from 'lucide-react';

interface CommandInterfaceProps {
  onCommand: (command: string) => void;
}

export const CommandInterface: React.FC<CommandInterfaceProps> = ({ onCommand }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'ai';
    message: string;
    timestamp: Date;
  }>>([
    {
      type: 'ai',
      message: 'Drishti AI Command Center online. How can I assist with event safety management?',
      timestamp: new Date()
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      type: 'user' as const,
      message: input,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    onCommand(input);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setConversation(prev => [...prev, {
        type: 'ai',
        message: aiResponse,
        timestamp: new Date()
      }]);
    }, 1000);

    setInput('');
  };

  const generateAIResponse = (command: string): string => {
    const lower = command.toLowerCase();
    
    if (lower.includes('west zone') || lower.includes('security concerns')) {
      return 'West Zone Analysis: Current occupancy at 85% capacity (12,750 attendees). 3 minor incidents reported in the past hour. Camera feed shows normal crowd movement with slight congestion near food vendors. Recommend deploying 2 additional security units to south entrance. No immediate threats detected.';
    }
    
    if (lower.includes('bottleneck') || lower.includes('crowd flow')) {
      return 'Bottleneck Prediction: High probability (78%) of congestion at Main Stage South in 12 minutes. Current flow rate exceeding safe threshold. Recommended actions: 1) Deploy crowd control barriers 2) Redirect traffic via East pathway 3) Alert security teams Alpha-3 and Beta-7.';
    }
    
    if (lower.includes('medical') || lower.includes('emergency')) {
      return 'Medical Response Status: 6 units available, average response time 3.2 minutes. Current incidents: 2 minor first aid cases in progress. Med-4 unit nearest to your location (East Zone). Emergency helicopter on standby at designated LZ.';
    }
    
    if (lower.includes('lost person') || lower.includes('missing')) {
      return 'Lost Person Protocol activated. AI vision scanning 47 active camera feeds. Please provide physical description or photo for facial recognition matching. Last 30 minutes of footage available for analysis. Current success rate: 87% within 15 minutes.';
    }
    
    return 'Command acknowledged. Processing real-time data from 127 sensors, 47 cameras, and 23 response units. Current system status: All green. How else can I assist with event safety management?';
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would start/stop speech recognition
  };

  const quickCommands = [
    'Summarize security concerns in West Zone',
    'Show predicted bottlenecks for next 15 minutes',
    'Deploy nearest medical unit to Main Stage',
    'Activate lost person search protocol'
  ];

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">AI Command Interface</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Drishti AI Online</span>
        </div>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-80">
        {conversation.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`p-2 rounded-lg ${msg.type === 'user' ? 'bg-cyan-600' : 'bg-gray-800'}`}>
                {msg.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-cyan-400" />
                )}
              </div>
              <div className={`p-3 rounded-lg ${
                msg.type === 'user' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-800 text-gray-200 border border-gray-700'
              }`}>
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString('en-US', { hour12: false })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Commands */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Quick Commands:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickCommands.map((cmd, index) => (
            <button
              key={index}
              onClick={() => setInput(cmd)}
              className="text-left p-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-600 transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Drishti AI about event safety, crowd analysis, resource deployment..."
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2 rounded-lg border transition-colors ${
            isListening 
              ? 'bg-red-600 border-red-500 text-white' 
              : 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white'
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:text-gray-400 text-white p-2 rounded-lg transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};