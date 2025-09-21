import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layers, RotateCw, ZoomIn, ZoomOut, Eye, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContaminationZone {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  contaminationLevel: number;
  bacterialCount: number;
  surface: string;
  lastCleaned: string;
  uvIntensity: number;
}

const Enhanced3DRoomView: React.FC = () => {
  const [viewAngle, setViewAngle] = useState(45);
  const [zoom, setZoom] = useState(1);
  const [selectedZone, setSelectedZone] = useState<ContaminationZone | null>(null);
  const [view3D, setView3D] = useState(true);
  const [heatmapMode, setHeatmapMode] = useState<'contamination' | 'bacterial' | 'uv'>('contamination');

  // Simulated room zones with 3D coordinates
  const [zones, setZones] = useState<ContaminationZone[]>([
    { id: 'door_handle', x: 50, y: 120, z: 0, width: 80, height: 60, depth: 20, contaminationLevel: 85, bacterialCount: 2800, surface: 'Door Handle', lastCleaned: '2 hours ago', uvIntensity: 65 },
    { id: 'bed_rail_1', x: 200, y: 200, z: 50, width: 120, height: 40, depth: 30, contaminationLevel: 72, bacterialCount: 1850, surface: 'Bed Rail', lastCleaned: '45 mins ago', uvIntensity: 78 },
    { id: 'iv_stand', x: 350, y: 150, z: 0, width: 60, height: 180, depth: 60, contaminationLevel: 28, bacterialCount: 420, surface: 'IV Stand', lastCleaned: '20 mins ago', uvIntensity: 92 },
    { id: 'monitor', x: 300, y: 80, z: 100, width: 100, height: 80, depth: 40, contaminationLevel: 45, bacterialCount: 980, surface: 'Monitor Screen', lastCleaned: '1 hour ago', uvIntensity: 85 },
    { id: 'sink', x: 450, y: 250, z: 0, width: 90, height: 70, depth: 50, contaminationLevel: 15, bacterialCount: 180, surface: 'Sink Faucet', lastCleaned: '10 mins ago', uvIntensity: 95 },
    { id: 'cabinet', x: 100, y: 50, z: 150, width: 150, height: 80, depth: 60, contaminationLevel: 38, bacterialCount: 720, surface: 'Cabinet Handle', lastCleaned: '30 mins ago', uvIntensity: 88 }
  ]);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => prev.map(zone => ({
        ...zone,
        contaminationLevel: Math.max(0, Math.min(100, zone.contaminationLevel + (Math.random() - 0.5) * 5)),
        bacterialCount: Math.max(0, zone.bacterialCount + (Math.random() - 0.5) * 100),
        uvIntensity: Math.max(60, Math.min(100, zone.uvIntensity + (Math.random() - 0.5) * 3))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getColorByLevel = (level: number, mode: string) => {
    if (mode === 'contamination') {
      if (level > 70) return '#ef4444'; // red
      if (level > 40) return '#f59e0b'; // yellow
      return '#10b981'; // green
    } else if (mode === 'bacterial') {
      if (level > 2000) return '#dc2626';
      if (level > 1000) return '#ea580c';
      return '#059669';
    } else { // uv
      if (level > 90) return '#10b981';
      if (level > 75) return '#f59e0b';
      return '#ef4444';
    }
  };

  const getIntensity = (zone: ContaminationZone) => {
    switch (heatmapMode) {
      case 'contamination': return zone.contaminationLevel;
      case 'bacterial': return Math.min(100, (zone.bacterialCount / 30));
      case 'uv': return zone.uvIntensity;
      default: return zone.contaminationLevel;
    }
  };

  const renderZone3D = (zone: ContaminationZone) => {
    const intensity = getIntensity(zone);
    const color = getColorByLevel(intensity, heatmapMode);
    const alpha = Math.max(0.3, intensity / 100);
    
    const style3D = {
      left: zone.x + Math.cos(viewAngle * Math.PI / 180) * zone.z * 0.5,
      top: zone.y - Math.sin(viewAngle * Math.PI / 180) * zone.z * 0.3,
      width: zone.width * zoom,
      height: zone.height * zoom,
      backgroundColor: `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`,
      border: `2px solid ${color}`,
      transform: `scale(${zoom}) perspective(400px) rotateX(${view3D ? 15 : 0}deg) rotateY(${view3D ? viewAngle : 0}deg)`,
      boxShadow: `0 ${zone.z * 0.1}px ${zone.z * 0.2}px rgba(0,0,0,0.3)`,
    };

    return (
      <motion.div
        key={zone.id}
        className="absolute rounded-lg cursor-pointer transition-all duration-300 hover:scale-110"
        style={style3D}
        onClick={() => setSelectedZone(zone)}
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="absolute -top-8 left-0 text-xs font-mono bg-background/80 px-2 py-1 rounded">
          {zone.surface}
        </div>
        <div className="absolute -bottom-6 right-0 text-xs font-mono bg-background/80 px-2 py-1 rounded">
          {intensity.toFixed(0)}{heatmapMode === 'uv' ? '%' : heatmapMode === 'bacterial' ? ' CFU' : '%'}
        </div>
      </motion.div>
    );
  };

  return (
    <Card className="glass-card border border-border/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">3D Room Contamination Map</h3>
              <p className="text-sm text-muted-foreground">Interactive Floor Plan Analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Heatmap Mode Selector */}
            <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
              {(['contamination', 'bacterial', 'uv'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={heatmapMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setHeatmapMode(mode)}
                  className="text-xs"
                >
                  {mode === 'contamination' ? 'Contamination' : mode === 'bacterial' ? 'Bacterial' : 'UV Intensity'}
                </Button>
              ))}
            </div>
            
            {/* View Controls */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView3D(!view3D)}
            >
              <Eye className="w-3 h-3 mr-1" />
              {view3D ? '2D' : '3D'}
            </Button>
          </div>
        </div>

        {/* 3D Room Container */}
        <div className="relative bg-muted/20 rounded-lg overflow-hidden mb-4" style={{ height: '400px' }}>
          {/* Room Outline */}
          <div className="absolute inset-4 border-2 border-muted-foreground/30 rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-background/40 to-muted/20"></div>
            
            {/* Grid Floor */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Render Zones */}
            {zones.map(renderZone3D)}

            {/* Room Labels */}
            <div className="absolute top-4 left-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
              Healthcare Room - {zones.length} Monitored Zones
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-background/90 p-3 rounded-lg">
              <div className="text-xs font-semibold mb-2">Risk Levels</div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-success rounded"></div>
                <span>Low</span>
                <div className="w-3 h-3 bg-warning rounded"></div>
                <span>Medium</span>
                <div className="w-3 h-3 bg-danger rounded"></div>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewAngle(prev => (prev + 15) % 360)}
            >
              <RotateCw className="w-3 h-3 mr-1" />
              Rotate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(prev => Math.min(2, prev + 0.2))}
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Badge className="bg-success/20 text-success">
              {zones.filter(z => getIntensity(z) < 30).length} Clean Zones
            </Badge>
            <Badge className="bg-warning/20 text-warning">
              {zones.filter(z => getIntensity(z) >= 30 && getIntensity(z) < 70).length} Medium Risk
            </Badge>
            <Badge className="bg-danger/20 text-danger">
              {zones.filter(z => getIntensity(z) >= 70).length} High Risk
            </Badge>
          </div>
        </div>

        {/* Zone Details Modal */}
        <AnimatePresence>
          {selectedZone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-4 right-4 bg-background border border-border rounded-lg p-4 shadow-lg z-10"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{selectedZone.surface}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedZone(null)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contamination:</span>
                  <span className="font-mono">{selectedZone.contaminationLevel.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bacterial Count:</span>
                  <span className="font-mono">{selectedZone.bacterialCount.toFixed(0)} CFU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">UV Intensity:</span>
                  <span className="font-mono">{selectedZone.uvIntensity.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Cleaned:</span>
                  <span className="font-mono">{selectedZone.lastCleaned}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default Enhanced3DRoomView;