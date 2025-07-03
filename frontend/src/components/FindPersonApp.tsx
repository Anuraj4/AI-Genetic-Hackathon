import React, { useState, useRef } from 'react';
import { Search, Camera, Phone, MapPin, Clock, CheckCircle, AlertTriangle, User, Upload, Mic, MicOff } from 'lucide-react';
import { useFindPersonData } from '../hooks/useFindPersonData';

export const FindPersonApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'search' | 'report' | 'status'>('search');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    searchResults,
    missingPersonReports,
    searchPerson,
    reportMissingPerson,
    updateReportStatus
  } = useFindPersonData();

  const [searchForm, setSearchForm] = useState({
    name: '',
    phone: '',
    ticketId: '',
    description: ''
  });

  const [reportForm, setReportForm] = useState({
    missingPersonName: '',
    missingPersonAge: '',
    missingPersonDescription: '',
    lastSeenLocation: '',
    lastSeenTime: '',
    reporterName: '',
    reporterPhone: '',
    reporterLocation: '',
    relationship: '',
    photo: null as File | null,
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPerson(searchForm);
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    reportMissingPerson(reportForm);
    setCurrentStep('status');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReportForm(prev => ({ ...prev, photo: file }));
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would start/stop voice recording
  };

  const renderSearchStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="text-center mb-6">
          <Search className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Find Someone at the Event</h2>
          <p className="text-gray-600">Search for attendees using their registration details</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={searchForm.name}
              onChange={(e) => setSearchForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the person's full name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={searchForm.phone}
                onChange={(e) => setSearchForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ticket ID (Optional)
              </label>
              <input
                type="text"
                value={searchForm.ticketId}
                onChange={(e) => setSearchForm(prev => ({ ...prev, ticketId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ticket ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Description
            </label>
            <textarea
              value={searchForm.description}
              onChange={(e) => setSearchForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Any additional details that might help locate them"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Search for Person
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600 mb-4">Can't find them in our system?</p>
          <button
            onClick={() => setCurrentStep('report')}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Report Missing Person
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Results</h3>
          <div className="space-y-4">
            {searchResults.map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{result.name}</h4>
                    <p className="text-sm text-gray-600">Last seen: {result.lastSeen}</p>
                    <p className="text-sm text-gray-600">Location: {result.currentZone}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      result.status === 'found' ? 'bg-green-100 text-green-800' :
                      result.status === 'searching' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                {result.status === 'found' && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Person found! They have been notified to meet you at {result.meetingPoint}.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderReportStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <AlertTriangle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Missing Person</h2>
          <p className="text-gray-600">Provide details to help us locate the missing person</p>
        </div>

        <form onSubmit={handleReport} className="space-y-6">
          {/* Missing Person Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Missing Person Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={reportForm.missingPersonName}
                  onChange={(e) => setReportForm(prev => ({ ...prev, missingPersonName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={reportForm.missingPersonAge}
                  onChange={(e) => setReportForm(prev => ({ ...prev, missingPersonAge: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Physical Description *
              </label>
              <div className="relative">
                <textarea
                  value={reportForm.missingPersonDescription}
                  onChange={(e) => setReportForm(prev => ({ ...prev, missingPersonDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-12"
                  rows={3}
                  placeholder="Height, build, hair color, clothing, distinctive features..."
                  required
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`absolute top-2 right-2 p-2 rounded-lg transition-colors ${
                    isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
              {isRecording && (
                <p className="text-sm text-red-600 mt-1">Recording... Speak your description</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo (Optional but Recommended)
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>
                {reportForm.photo && (
                  <span className="text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Photo uploaded
                  </span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Last Seen Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Last Seen Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <select
                  value={reportForm.lastSeenLocation}
                  onChange={(e) => setReportForm(prev => ({ ...prev, lastSeenLocation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Select location</option>
                  <option value="Main Stage North">Main Stage North</option>
                  <option value="Main Stage South">Main Stage South</option>
                  <option value="Food Court East">Food Court East</option>
                  <option value="Food Court West">Food Court West</option>
                  <option value="West Gate">West Gate</option>
                  <option value="East Gate">East Gate</option>
                  <option value="VIP Section">VIP Section</option>
                  <option value="Merchandise Area">Merchandise Area</option>
                  <option value="Restroom Area">Restroom Area</option>
                  <option value="Parking Lot">Parking Lot</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  value={reportForm.lastSeenTime}
                  onChange={(e) => setReportForm(prev => ({ ...prev, lastSeenTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Reporter Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={reportForm.reporterName}
                  onChange={(e) => setReportForm(prev => ({ ...prev, reporterName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Phone Number *
                </label>
                <input
                  type="tel"
                  value={reportForm.reporterPhone}
                  onChange={(e) => setReportForm(prev => ({ ...prev, reporterPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Current Location *
                </label>
                <select
                  value={reportForm.reporterLocation}
                  onChange={(e) => setReportForm(prev => ({ ...prev, reporterLocation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Select your location</option>
                  <option value="Main Stage North">Main Stage North</option>
                  <option value="Main Stage South">Main Stage South</option>
                  <option value="Food Court East">Food Court East</option>
                  <option value="Food Court West">Food Court West</option>
                  <option value="West Gate">West Gate</option>
                  <option value="East Gate">East Gate</option>
                  <option value="VIP Section">VIP Section</option>
                  <option value="Merchandise Area">Merchandise Area</option>
                  <option value="Information Booth">Information Booth</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship
                </label>
                <select
                  value={reportForm.relationship}
                  onChange={(e) => setReportForm(prev => ({ ...prev, relationship: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select relationship</option>
                  <option value="family">Family Member</option>
                  <option value="friend">Friend</option>
                  <option value="partner">Partner/Spouse</option>
                  <option value="colleague">Colleague</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Urgency Level */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Urgency Level</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 border-green-300' },
                { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
                { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-300' },
                { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800 border-red-300' }
              ].map((urgency) => (
                <button
                  key={urgency.value}
                  type="button"
                  onClick={() => setReportForm(prev => ({ ...prev, urgency: urgency.value as any }))}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                    reportForm.urgency === urgency.value 
                      ? urgency.color 
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {urgency.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setCurrentStep('search')}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Back to Search
            </button>
            <button
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderStatusStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Report Submitted Successfully</h2>
        <p className="text-gray-600 mb-6">
          Your missing person report has been submitted to our AI-powered search system. 
          We're now scanning camera feeds and will notify you immediately if we locate them.
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">What happens next:</h3>
          <ul className="text-sm text-blue-700 space-y-1 text-left">
            <li>• AI facial recognition scanning all camera feeds</li>
            <li>• Public announcement will be made in 5 minutes</li>
            <li>• Security teams have been notified</li>
            <li>• You'll receive SMS updates on this number: {reportForm.reporterPhone}</li>
          </ul>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => {
              setCurrentStep('search');
              setReportForm({
                missingPersonName: '',
                missingPersonAge: '',
                missingPersonDescription: '',
                lastSeenLocation: '',
                lastSeenTime: '',
                reporterName: '',
                reporterPhone: '',
                reporterLocation: '',
                relationship: '',
                photo: null,
                urgency: 'medium'
              });
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Submit Another Report
          </button>
          
          <button
            onClick={() => setCurrentStep('search')}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Back to Search
          </button>
        </div>
      </div>

      {/* Active Reports */}
      {missingPersonReports.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Active Reports</h3>
          <div className="space-y-4">
            {missingPersonReports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{report.missingPersonName}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report.status === 'found' ? 'bg-green-100 text-green-800' :
                    report.status === 'searching' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'announced' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><Clock className="w-4 h-4 inline mr-1" />Reported: {report.reportedAt.toLocaleTimeString()}</p>
                  <p><MapPin className="w-4 h-4 inline mr-1" />Last seen: {report.lastSeenLocation}</p>
                  {report.aiDetections > 0 && (
                    <p className="text-blue-600">
                      <Camera className="w-4 h-4 inline mr-1" />
                      AI detected {report.aiDetections} potential matches
                    </p>
                  )}
                </div>
                {report.status === 'found' && report.meetingPoint && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Person found! Meeting point: {report.meetingPoint}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Search className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Find Someone</h1>
                <p className="text-sm text-gray-600">Event Attendee Locator Service</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-600 text-sm font-medium">AI System Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'search' && renderSearchStep()}
        {currentStep === 'report' && renderReportStep()}
        {currentStep === 'status' && renderStatusStep()}
      </main>

      {/* Emergency Contact */}
      <div className="fixed bottom-4 right-4">
        <button className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-colors">
          <Phone className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};