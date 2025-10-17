import { Users, Clock, AlertTriangle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ModelCardProps {
  name: string;
  color: string;
  cost: number;
  effort: number;
  duration: number;
  risk: 'low' | 'medium' | 'high';
  isRecommended?: boolean;
  currencySymbol: string;
}

export const ModelCard = ({
  name,
  color,
  cost,
  effort,
  duration,
  risk,
  isRecommended,
  currencySymbol
}: ModelCardProps) => {
  const getRiskColor = () => {
    switch (risk) {
      case 'low': return 'hsl(var(--success))';
      case 'medium': return 'hsl(var(--warning))';
      case 'high': return 'hsl(var(--error))';
    }
  };

  const getRiskWidth = () => {
    switch (risk) {
      case 'low': return '33%';
      case 'medium': return '66%';
      case 'high': return '100%';
    }
  };

  return (
    <Card 
      className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      style={{ borderTopWidth: '4px', borderTopColor: color }}
    >
      {isRecommended && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-success text-white gap-1">
            <Star className="w-3 h-3 fill-current" />
            Recommended
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cost Display */}
        <div className="text-center py-4 bg-muted/30 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Estimated Cost</div>
          <div className="text-3xl font-bold" style={{ color }}>
            {currencySymbol}{cost.toLocaleString()}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-xs text-muted-foreground">Effort</div>
              <div className="font-semibold">{effort.toFixed(1)} PM</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="font-semibold">{duration.toFixed(1)} mo</div>
            </div>
          </div>
        </div>

        {/* Risk Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Risk Level
            </span>
            <span className="font-medium capitalize">{risk}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: getRiskWidth(),
                backgroundColor: getRiskColor()
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
