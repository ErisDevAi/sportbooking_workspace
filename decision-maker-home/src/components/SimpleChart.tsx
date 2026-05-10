'use client';

import { Card } from 'antd';

interface SimpleChartProps {
  title: string;
  data: number[];
  labels: string[];
  color: string;
}

export default function SimpleChart({ title, data, labels, color }: SimpleChartProps) {
  const max = Math.max(...data);

  return (
    <Card title={title}>
      <div className="flex items-end gap-2 h-48">
        {data.map((value, index) => (
          <div key={labels[index]} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500">{value}</span>
            <div
              className="w-full rounded-t transition-all hover:opacity-80"
              style={{
                height: `${(value / max) * 100}%`,
                backgroundColor: color,
                minHeight: 4,
              }}
            />
            <span className="text-xs text-gray-400">{labels[index]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
