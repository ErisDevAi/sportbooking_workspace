'use client';

import { Card } from 'antd';
import type { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
  change: string;
}

export default function StatsCard({ title, value, icon, color, change }: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold m-0">{value}</p>
          <p className="text-green-500 text-sm mt-1 m-0">{change} from last month</p>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
