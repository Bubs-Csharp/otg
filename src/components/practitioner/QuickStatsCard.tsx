import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface QuickStatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: { value: number; isPositive: boolean };
  iconBgColor?: string;
  iconColor?: string;
}

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({
  icon: Icon,
  value,
  label,
  trend,
  iconBgColor = 'bg-primary/10',
  iconColor = 'text-primary',
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
          {trend && (
            <div className={`text-sm font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
