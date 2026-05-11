'use client';

import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Spin, Row, Col, Statistic, Avatar } from 'antd';
import { UserOutlined, EditOutlined, TrophyOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { usersApi } from '@/api/users';
import { spinHistoryApi } from '@/api/spin-histories';
import type { Streak } from '@/types/spin-histories';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  permissions: string[];
}

export default function ProfilePage() {
  const { user: authUser, token } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchStreaks();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await authApi.me();
      setUser(res.data.data);
      form.setFieldsValue({ name: res.data.data.name });
    } catch (error) {
      message.error('Failed to load profile');
    }
  };

  const fetchStreaks = async () => {
    try {
      const res = await spinHistoryApi.getStreak();
      setStreaks(res.data.data);
    } catch (error) {
      message.error('Failed to load streaks');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async (values: { name: string }) => {
    if (!user) return;
    try {
      await usersApi.update(user._id, { name: values.name });
      message.success('Name updated successfully');
      setEditing(false);
      fetchProfile(); // Refresh profile
    } catch (error) {
      message.error('Failed to update name');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <div>Failed to load profile</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="User Information" extra={
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => setEditing(!editing)}
            >
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          }>
            <div className="flex items-center mb-4">
              <Avatar size={64} icon={<UserOutlined />} className="mr-4" />
              <div>
                {editing ? (
                  <Form form={form} onFinish={handleUpdateName} layout="inline">
                    <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
                      <Input placeholder="Enter your name" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" size="small">
                        Save
                      </Button>
                    </Form.Item>
                  </Form>
                ) : (
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title={<><TrophyOutlined /> Streak Overview</>}>
            {streaks.length === 0 ? (
              <p>No streaks yet. Start spinning to build your streaks!</p>
            ) : (
              <div className="space-y-4">
                {streaks.map((streak) => (
                  <div key={streak.categoryId._id} className="border rounded p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{streak.categoryId.name}</h3>
                        <p className="text-sm text-gray-600">Total spins: {streak.totalSpins}</p>
                      </div>
                      <div className="text-right">
                        <Statistic
                          title="Current Streak"
                          value={streak.currentStreak}
                          suffix="days"
                          valueStyle={{ color: '#3f8600' }}
                        />
                        <Statistic
                          title="Max Streak"
                          value={streak.maxStreak}
                          suffix="days"
                          valueStyle={{ color: '#1890ff' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}