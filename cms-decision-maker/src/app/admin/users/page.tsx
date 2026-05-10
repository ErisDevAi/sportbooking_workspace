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
  Space,
  Switch,
  Popconfirm,
  Avatar,
  App,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { usersApi } from '@/api/users';
import type { User } from '@/types/user';

export default function UsersPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');

  const fetchUsers = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await usersApi.getAll(page, limit);
      setUsers(res.data.data);
      if (res.data.meta) {
        setPagination({
          current: res.data.meta.page,
          pageSize: res.data.meta.limit,
          total: res.data.meta.total,
        });
      }
    } catch {
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    try {
      setSubmitting(true);
      if (editingUser) {
        await usersApi.update(editingUser._id, {
          name: values.name,
          email: values.email,
          role: values.role,
          isActive: values.isActive,
        });
        message.success('Cập nhật người dùng thành công');
      } else {
        await usersApi.create({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        });
        message.success('Tạo người dùng thành công');
      }
      setIsModalOpen(false);
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersApi.delete(id);
      message.success('Xóa người dùng thành công');
      fetchUsers(pagination.current, pagination.pageSize);
    } catch {
      message.error('Xóa thất bại');
    }
  };

  const filteredUsers = searchText
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchText.toLowerCase()) ||
          u.email.toLowerCase().includes(searchText.toLowerCase())
      )
    : users;

  const roleColors: Record<string, string> = {
    admin: 'red',
    moderator: 'orange',
    editor: 'blue',
    viewer: 'green',
    user: 'default',
  };

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_: any, record: User) => (
        <div className="flex items-center gap-3">
          <Avatar className="bg-purple-100 text-purple-600" icon={<UserOutlined />}>
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <p className="font-semibold text-slate-800 leading-tight">{record.name}</p>
            <p className="text-xs text-slate-400">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: string) => (
        <Tag color={roleColors[role] || 'default'} className="!font-semibold !capitalize">
          {role}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean) => (
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-slate-300'}`} />
          <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-slate-400'}`}>
            {isActive ? 'Hoạt động' : 'Đã khóa'}
          </span>
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      render: (date: string) => (
        <span className="text-sm text-slate-500">
          {new Date(date).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            className="!text-blue-500"
          />
          <Popconfirm
            title="Xóa người dùng?"
            description="Hành động này không thể hoàn tác"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" size="small" icon={<DeleteOutlined />} className="!text-red-500" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Quản lý tài khoản</h1>
          <p className="text-sm text-slate-500 mt-0.5">Tạo, chỉnh sửa và quản lý người dùng hệ thống</p>
        </div>
        <div className="flex gap-3">
          <Input
            placeholder="Tìm theo tên hoặc email..."
            prefix={<SearchOutlined className="text-slate-300" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="!w-[250px] !rounded-lg"
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal} className="!rounded-lg !font-semibold">
            Thêm người dùng
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        loading={loading}
        className="rounded-lg overflow-hidden"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => <span className="text-sm text-slate-500">Tổng {total} người dùng</span>,
          onChange: (page, pageSize) => fetchUsers(page, pageSize),
        }}
      />

      <Modal
        title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText={editingUser ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        width={480}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ role: 'viewer', isActive: true }}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input placeholder="Nguyễn Văn A" size="large" className="!rounded-lg" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="email@example.com" size="large" className="!rounded-lg" />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
              ]}
            >
              <Input.Password placeholder="Tối thiểu 6 ký tự" size="large" className="!rounded-lg" />
            </Form.Item>
          )}
          <Form.Item name="role" label="Vai trò">
            <Select size="large" className="!rounded-lg">
              <Select.Option value="viewer">Viewer - Xem dữ liệu</Select.Option>
              <Select.Option value="editor">Editor - Quản lý nội dung</Select.Option>
              <Select.Option value="admin">Admin - Toàn quyền</Select.Option>
            </Select>
          </Form.Item>
          {editingUser && (
            <Form.Item name="isActive" label="Trạng thái tài khoản" valuePropName="checked">
              <Switch checkedChildren="Hoạt động" unCheckedChildren="Đã khóa" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
