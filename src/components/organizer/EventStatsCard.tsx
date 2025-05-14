
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from 'lucide-react';

interface EventStatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const EventStatsCard: React.FC<EventStatsCardProps> = ({ 
  title,
  value,
  icon,
  trend,
  trendUp = true
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            {React.cloneElement(icon as React.ReactElement, {
              className: "h-5 w-5 text-primary"
            })}
          </div>
        </div>
        
        {trend && (
          <div className="mt-3 flex items-center text-xs font-medium">
            {trendUp ? (
              <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1 text-red-500" />
            )}
            <span className={trendUp ? "text-green-500" : "text-red-500"}>
              {trend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventStatsCard;
