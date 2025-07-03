import { useState, useCallback } from 'react';

export interface SearchResult {
  id: string;
  name: string;
  phone: string;
  ticketId: string;
  lastSeen: string;
  currentZone: string;
  status: 'found' | 'searching' | 'not_found';
  meetingPoint?: string;
}

export interface MissingPersonReport {
  id: string;
  missingPersonName: string;
  missingPersonAge: string;
  missingPersonDescription: string;
  lastSeenLocation: string;
  lastSeenTime: string;
  reporterName: string;
  reporterPhone: string;
  reporterLocation: string;
  relationship: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'searching' | 'announced' | 'found';
  reportedAt: Date;
  aiDetections: number;
  meetingPoint?: string;
  estimatedSearchTime?: number;
}

export interface SearchForm {
  name: string;
  phone: string;
  ticketId: string;
  description: string;
}

export interface ReportForm {
  missingPersonName: string;
  missingPersonAge: string;
  missingPersonDescription: string;
  lastSeenLocation: string;
  lastSeenTime: string;
  reporterName: string;
  reporterPhone: string;
  reporterLocation: string;
  relationship: string;
  photo: File | null;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export const useFindPersonData = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [missingPersonReports, setMissingPersonReports] = useState<MissingPersonReport[]>([]);

  const searchPerson = useCallback((searchForm: SearchForm) => {
    // Simulate API call to search for person in registration database
    setTimeout(() => {
      const mockResults: SearchResult[] = [];
      
      // Simulate finding person in database
      if (searchForm.name.toLowerCase().includes('john') || searchForm.phone.includes('555')) {
        mockResults.push({
          id: 'search-1',
          name: searchForm.name || 'John Smith',
          phone: searchForm.phone || '+1 (555) 123-4567',
          ticketId: searchForm.ticketId || 'TKT-2024-001',
          lastSeen: '2 minutes ago',
          currentZone: 'Food Court East',
          status: 'found',
          meetingPoint: 'Information Booth near Main Stage'
        });
      } else if (searchForm.name.toLowerCase().includes('sarah')) {
        mockResults.push({
          id: 'search-2',
          name: 'Sarah Johnson',
          phone: '+1 (555) 987-6543',
          ticketId: 'TKT-2024-002',
          lastSeen: '15 minutes ago',
          currentZone: 'Main Stage North',
          status: 'searching'
        });
      } else if (searchForm.name) {
        // Person not found in immediate search, but AI is looking
        mockResults.push({
          id: 'search-3',
          name: searchForm.name,
          phone: searchForm.phone || 'Not available',
          ticketId: searchForm.ticketId || 'Not found',
          lastSeen: 'Unknown',
          currentZone: 'AI Scanning in progress...',
          status: 'searching'
        });
      }
      
      setSearchResults(mockResults);
    }, 1500);
  }, []);

  const reportMissingPerson = useCallback((reportForm: ReportForm) => {
    const newReport: MissingPersonReport = {
      id: `report-${Date.now()}`,
      missingPersonName: reportForm.missingPersonName,
      missingPersonAge: reportForm.missingPersonAge,
      missingPersonDescription: reportForm.missingPersonDescription,
      lastSeenLocation: reportForm.lastSeenLocation,
      lastSeenTime: reportForm.lastSeenTime,
      reporterName: reportForm.reporterName,
      reporterPhone: reportForm.reporterPhone,
      reporterLocation: reportForm.reporterLocation,
      relationship: reportForm.relationship,
      urgency: reportForm.urgency,
      status: 'reported',
      reportedAt: new Date(),
      aiDetections: 0,
      estimatedSearchTime: reportForm.urgency === 'critical' ? 5 : 
                          reportForm.urgency === 'high' ? 10 : 
                          reportForm.urgency === 'medium' ? 15 : 20
    };

    setMissingPersonReports(prev => [newReport, ...prev]);

    // Simulate AI processing and announcements
    setTimeout(() => {
      setMissingPersonReports(prev => prev.map(report => 
        report.id === newReport.id 
          ? { ...report, status: 'announced' as const }
          : report
      ));
    }, 3000);

    // Simulate AI detections
    setTimeout(() => {
      setMissingPersonReports(prev => prev.map(report => 
        report.id === newReport.id 
          ? { ...report, status: 'searching' as const, aiDetections: Math.floor(Math.random() * 3) + 1 }
          : report
      ));
    }, 8000);

    // Simulate finding person (50% chance)
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const meetingPoints = [
          'Information Booth near Main Stage',
          'Security Station at West Gate',
          'First Aid Station',
          'Lost & Found at East Gate',
          'VIP Section Entrance'
        ];
        
        setMissingPersonReports(prev => prev.map(report => 
          report.id === newReport.id 
            ? { 
                ...report, 
                status: 'found' as const, 
                meetingPoint: meetingPoints[Math.floor(Math.random() * meetingPoints.length)],
                aiDetections: report.aiDetections + 1
              }
            : report
        ));
      }, 15000 + Math.random() * 30000); // 15-45 seconds
    }
  }, []);

  const updateReportStatus = useCallback((reportId: string, status: MissingPersonReport['status']) => {
    setMissingPersonReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, status } : report
    ));
  }, []);

  return {
    searchResults,
    missingPersonReports,
    searchPerson,
    reportMissingPerson,
    updateReportStatus
  };
};