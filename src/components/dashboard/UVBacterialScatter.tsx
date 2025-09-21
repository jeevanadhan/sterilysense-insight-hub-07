import React from 'react';
import { Card } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';

const UVBacterialScatter: React.FC = () => {
  // Enhanced scatter data with better correlation and realistic ranges
  const scatterData = Array.from({ length: 75 }, (_, i) => {
    const uvIntensity = 60 + Math.random() * 40; // 60-100%
    const baseReduction = 0.75 + (uvIntensity - 60) / 40 * 0.2; // 75-95% reduction
    const humidity = 35 + Math.random() * 40; // 35-75%
    const humidityPenalty = (humidity - 35) / 40 * 0.15; // Up to 15% penalty for high humidity
    const actualReduction = Math.max(0.5, baseReduction - humidityPenalty);
    const initialBacterial = 200 + Math.random() * 2800; // 200-3000 CFU
    const finalBacterial = initialBacterial * (1 - actualReduction) + Math.random() * 100;
    
    return {
      uv: Math.round(uvIntensity * 100) / 100, // 2 decimal places
      bacterial: Math.max(50, Math.round(finalBacterial)),
      location: ['Door Handle', 'Bed Rail', 'IV Stand', 'Monitor Screen', 'Sink Faucet', 'Window Sill'][Math.floor(Math.random() * 6)],
      humidity: Math.round(humidity * 100) / 100,
      efficiency: Math.round(actualReduction * 100)
    };
  });

  return (
    <Card className="glass-card border border-border/50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/20">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">UV Efficiency vs Bacterial Load</h3>
            <p className="text-sm text-muted-foreground">Correlation Analysis</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart data={scatterData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="uv" 
              name="UV Intensity" 
              unit="%" 
              stroke="hsl(var(--muted-foreground))"
              domain={[60, 100]}
              type="number"
              tickFormatter={(value) => `${value.toFixed(2)}%`}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              dataKey="bacterial" 
              name="Bacterial Load" 
              unit=" CFU" 
              stroke="hsl(var(--muted-foreground))"
              domain={[0, 3000]}
              tickFormatter={(value) => `${value.toFixed(0)}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))'
              }}
              formatter={(value, name) => [
                `${typeof value === 'number' ? value.toFixed(2) : value}${name === 'UV Intensity' ? '%' : ' CFU'}`,
                name
              ]}
              labelFormatter={(label, payload) => 
                payload?.[0] ? `Location: ${payload[0].payload.location} | Humidity: ${payload[0].payload.humidity.toFixed(1)}%` : ''
              }
            />
            <Scatter 
              dataKey="bacterial" 
              fill="hsl(var(--primary))"
              fillOpacity={0.7}
              stroke="hsl(var(--primary))"
              strokeWidth={1}
            />
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Correlation Analysis */}
        <div className="mt-4 p-4 bg-muted/20 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-success">-0.84</div>
              <div className="text-muted-foreground">Correlation (r)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">71%</div>
              <div className="text-muted-foreground">Variance Explained (r²)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-warning">18.2%</div>
              <div className="text-muted-foreground">Avg. Reduction per 10% UV</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UVBacterialScatter;