import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Activity, Shield, Zap } from 'lucide-react';
import DateFilterPanel from '@/components/dashboard/DateFilterPanel';
import Enhanced3DRoomView from '@/components/dashboard/Enhanced3DRoomView';
import LiveCameraFeed from '@/components/dashboard/LiveCameraFeed';
import EnhancedHygieneScores from '@/components/dashboard/EnhancedHygieneScores';
import ContaminationForecast from '@/components/dashboard/ContaminationForecast';
import ROIDashboard from '@/components/dashboard/ROIDashboard';
import AIInsightPanel from '@/components/dashboard/AIInsightPanel';
import EnhancedSensorHealth from '@/components/dashboard/EnhancedSensorHealth';
import UVBacterialScatter from '@/components/dashboard/UVBacterialScatter';
import ContaminationFlow from '@/components/dashboard/ContaminationFlow';

const Index = () => {
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  });

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange({ start: startDate, end: endDate });
    // Here you would typically filter your data based on the date range
    console.log('Date range changed:', { startDate, endDate });
  };

  const handleDataUpload = (file: File) => {
    // Handle file upload and data processing
    console.log('File uploaded:', file.name);
    // You would typically parse the Excel/CSV file and update your data
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-primary">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">SterilySense</h1>
              <p className="text-muted-foreground">AI-Powered UV Disinfection Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-success text-success-foreground animate-pulse-glow">
              <Activity className="w-3 h-3 mr-1" />
              System Online
            </Badge>
            <Badge variant="outline" className="font-mono">
              IIT Pals Team
            </Badge>
          </div>
        </div>
      </div>

      {/* Date Filter & Upload Panel */}
      <DateFilterPanel 
        onDateRangeChange={handleDateRangeChange}
        onDataUpload={handleDataUpload}
      />

      {/* Dashboard Grid */}
      <div className="space-y-8">
        {/* Row 1: 3D Room View (Full Width) */}
        <Enhanced3DRoomView />

        {/* Row 2: Live Feed & Enhanced Hygiene Scores */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <LiveCameraFeed />
          <EnhancedHygieneScores />
        </div>

        {/* Row 3: Forecast & ROI */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ContaminationForecast />
          <ROIDashboard />
        </div>

        {/* Row 4: AI Insights (Full Width) */}
        <AIInsightPanel />

        {/* Row 5: Enhanced Sensor Health & Analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <EnhancedSensorHealth />
          <div className="space-y-6">
            <UVBacterialScatter />
            <ContaminationFlow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
