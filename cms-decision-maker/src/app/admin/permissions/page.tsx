'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Popconfirm,
  App,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { permissionsApi, type Permission } from '@/api/permissions';

export default function PermissionsPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await permissionsApi.getAll();
      setPermissions(res.data.data);
    } catch {
      message.error('Không thể tải quyền hạn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const showCreateModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    try {
      setSubmitting(true);
      await permissionsApi.create(values);
      message.success('Tạo quyền hạn thành công');
      setIsModalOpen(false);
      fetchPermissions();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await permissionsApi.delete(id);
      message.success('Xóa quyền hạn thành công');
      fetchPermissions();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  // Group by module for display
  const modules = [...new Set(permissions.map((p) => p.module))];

  const moduleColors: Record<string, string> = {
    users: 'blue',
    roles: 'purple',
    permissions: 'magenta',
    categories: 'green',
    'wheel-contents': 'orange',
    'spin-history': 'red',
    dashboard: 'cyan',
  };

  const columns = [
    {
      title: 'Quyền hạn',
      key: 'permission',
      render: (_: any, record: Permission) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
            <KeyOutlined className="text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{record.label}</p>
            <p className="text-xs text-slate-400 font-mono">{record.slug}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string) => (
        <span className="text-sm text-slate-500">{desc || '—'}</span>
      ),
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      width: 140,
      filters: modules.map((m) => ({ text: m, value: m })),
      onFilter: (value: any, record: Permission) => record.module === value,
      render: (module: string) => (
        <Tag color={moduleColors[module] || 'default'} className="!font-medium !capitalize">
          {module}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 80,
      render: (_: any, record: Permission) => (
        <Popconfirm
          title="Xóa quyền hạn này?"
          description="Hành động này không thể hoàn tác"
          onConfirm={() => handleDelete(record._id)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button type="text" size="small" icon={<DeleteOutlined />} className="!text-red-500" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Quản lý quyền hạn</h1>
          <p className="text-sm text-slate-500 mt-0.5">Xem và tạo các quyền hạn trong hệ thống ({permissions.length} quyền)</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal} className="!rounded-lg !font-semibold">
          Thêm quyền hạn
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={permissions}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 20,
          showTotal: (total) => <span className="text-sm text-slate-500">Tổng {total} quyền hạn</span>,
        }}
      />

      <Modal
        title="Tạo quyền hạn mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText="Tạo mới"
        cancelText="Hủy"
        width={480}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
          >
            <Input placeholder="Ví dụ: manage_reports" size="large" className="!rounded-lg" />
          </Form.Item>
          <Form.Item
            name="label"
            label="Tên hiển thị"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input placeholder="Ví dụ: Quản lý báo cáo" size="large" className="!rounded-lg" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} placeholder="Mô tả quyền hạn này..." />
          </Form.Item>
          <Form.Item
            name="module"
            label="Module"
            rules={[{ required: true, message: 'Vui lòng chọn module' }]}
          >
            <Select placeholder="Chọn module" size="large">
              {['users', 'roles', 'permissions', 'categories', 'wheel-contents', 'spin-history', 'dashboard'].map((m) => (
                <Select.Option key={m} value={m}>{m}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
