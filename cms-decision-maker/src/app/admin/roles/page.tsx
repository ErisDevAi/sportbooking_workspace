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
  Popconfirm,
  App,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { rolesApi, type Role } from '@/api/roles';
import { permissionsApi, type Permission } from '@/api/permissions';

export default function RolesPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, permsRes] = await Promise.all([
        rolesApi.getAll(),
        permissionsApi.getAll(),
      ]);
      setRoles(rolesRes.data.data);
      setPermissions(permsRes.data.data);
    } catch {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showCreateModal = () => {
    setEditingRole(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (role: Role) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      label: role.label,
      permissions: role.permissions,
    });
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    try {
      setSubmitting(true);
      if (editingRole) {
        await rolesApi.update(editingRole._id, values);
        message.success('Cập nhật vai trò thành công');
      } else {
        await rolesApi.create(values);
        message.success('Tạo vai trò thành công');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await rolesApi.delete(id);
      message.success('Xóa vai trò thành công');
      fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, p) => {
    if (!acc[p.module]) acc[p.module] = [];
    acc[p.module].push(p);
    return acc;
  }, {} as Record<string, Permission[]>);

  const columns = [
    {
      title: 'Vai trò',
      key: 'role',
      render: (_: any, record: Role) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
            <LockOutlined className="text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{record.label}</p>
            <p className="text-xs text-slate-400">{record.name}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Quyền hạn',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (perms: string[]) => (
        <div className="flex flex-wrap gap-1">
          {perms.length > 3 ? (
            <>
              {perms.slice(0, 3).map((p) => (
                <Tag key={p} color="blue" className="!text-xs">{p}</Tag>
              ))}
              <Tag className="!text-xs">+{perms.length - 3}</Tag>
            </>
          ) : (
            perms.map((p) => <Tag key={p} color="blue" className="!text-xs">{p}</Tag>)
          )}
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'isSystem',
      key: 'isSystem',
      width: 100,
      render: (isSystem: boolean) => (
        <Tag color={isSystem ? 'red' : 'default'}>{isSystem ? 'Hệ thống' : 'Tùy chỉnh'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_: any, record: Role) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            className="!text-blue-500"
            disabled={record.isSystem}
          />
          <Popconfirm
            title="Xóa vai trò này?"
            description="Hành động này không thể hoàn tác"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              className="!text-red-500"
              disabled={record.isSystem}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Quản lý vai trò</h1>
          <p className="text-sm text-slate-500 mt-0.5">Tạo và phân quyền cho các vai trò trong hệ thống</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal} className="!rounded-lg !font-semibold">
          Thêm vai trò
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingRole ? 'Chỉnh sửa vai trò' : 'Tạo vai trò mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText={editingRole ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        width={560}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
          <Form.Item
            name="name"
            label="Tên vai trò (slug)"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input placeholder="Ví dụ: content_manager" size="large" className="!rounded-lg" disabled={!!editingRole} />
          </Form.Item>
          <Form.Item
            name="label"
            label="Tên hiển thị"
            rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị' }]}
          >
            <Input placeholder="Ví dụ: Quản lý nội dung" size="large" className="!rounded-lg" />
          </Form.Item>
          <Form.Item name="permissions" label="Quyền hạn">
            <Select
              mode="multiple"
              placeholder="Chọn quyền hạn..."
              size="large"
              optionFilterProp="label"
              className="!rounded-lg"
            >
              {Object.entries(permissionsByModule).map(([module, perms]) => (
                <Select.OptGroup key={module} label={module.toUpperCase()}>
                  {perms.map((p) => (
                    <Select.Option key={p.slug} value={p.slug} label={p.label}>
                      <div>
                        <span className="font-medium">{p.label}</span>
                        <span className="text-xs text-slate-400 ml-2">({p.slug})</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
