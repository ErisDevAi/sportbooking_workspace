'use client';

import { Row, Col } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import StatsCard from '@/components/StatsCard';
import SimpleChart from '@/components/SimpleChart';

const stats = [
  { title: 'Total Users', value: '12,845', icon: <UserOutlined />, color: '#1677ff', change: '+12%' },
  { title: 'Orders', value: '3,672', icon: <ShoppingCartOutlined />, color: '#52c41a', change: '+8%' },
  { title: 'Revenue', value: '$48,200', icon: <DollarOutlined />, color: '#faad14', change: '+23%' },
  { title: 'Growth', value: '18.2%', icon: <RiseOutlined />, color: '#eb2f96', change: '+4%' },
];

export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>

      <Row gutter={[16, 16]}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              change={stat.change}
            />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={12}>
          <SimpleChart
            title="Monthly Revenue"
            data={[12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45]}
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            color="#1677ff"
          />
        </Col>
        <Col xs={24} lg={12}>
          <SimpleChart
            title="New Users"
            data={[80, 120, 100, 140, 160, 130, 170, 190, 150, 200, 180, 220]}
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            color="#52c41a"
          />
        </Col>
      </Row>
    </div>
  );
}
