'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  ColorPicker,
  Switch,
  Tag,
  Space,
  Popconfirm,
  App,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { categoriesApi } from '@/api/categories';
import type { Category } from '@/types/category';

export default function CategoriesPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesApi.getAll();
      setCategories(res.data.data);
    } catch {
      message.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showCreateModal = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (item: Category) => {
    setEditingItem(item);
    form.setFieldsValue({
      name: item.name,
      color: item.color,
      description: item.description,
      isPublic: item.isPublic,
    });
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    const hexColor =
      typeof values.color === 'string'
        ? values.color
        : values.color?.toHexString() || '#E53E3E';

    const payload = { ...values, color: hexColor };

    try {
      setSubmitting(true);
      if (editingItem) {
        await categoriesApi.update(editingItem._id, payload);
        message.success('Cập nhật danh mục thành công');
      } else {
        await categoriesApi.create(payload);
        message.success('Tạo danh mục thành công');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoriesApi.delete(id);
      message.success('Xóa danh mục thành công');
      fetchCategories();
    } catch {
      message.error('Xóa thất bại');
    }
  };

  const columns = [
    {
      title: 'Danh mục',
      key: 'category',
      render: (_: any, record: Category) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: `${record.color}15` }}
          >
            <AppstoreOutlined />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{record.name}</p>
            <p className="text-xs text-slate-400">{record.slug}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Màu',
      dataIndex: 'color',
      key: 'color',
      width: 70,
      render: (color: string) => (
        <div className="w-6 h-6 rounded-lg border border-slate-200" style={{ backgroundColor: color }} />
      ),
    },
    {
      title: 'Số lựa chọn',
      dataIndex: 'choiceCount',
      key: 'choiceCount',
      width: 120,
      render: (count: number) => (
        <span className="text-sm font-semibold text-slate-600">{count || 0}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isPublic',
      key: 'isPublic',
      width: 120,
      render: (isPublic: boolean) => (
        <Tag color={isPublic ? 'green' : 'default'} className="!font-medium">
          {isPublic ? 'Công khai' : 'Riêng tư'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => (
        <span className="text-sm text-slate-500">{new Date(date).toLocaleDateString('vi-VN')}</span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_: any, record: Category) => (
        <Space>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => showEditModal(record)} className="!text-blue-500" />
          <Popconfirm
            title="Xóa danh mục?"
            description="Tất cả lựa chọn bên trong cũng sẽ bị xóa"
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
          <h1 className="text-xl font-bold text-slate-800">Quản lý danh mục</h1>
          <p className="text-sm text-slate-500 mt-0.5">Tạo và quản lý các thư mục phân loại quyết định</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal} className="!rounded-lg !font-semibold">
          Thêm danh mục
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => <span className="text-sm text-slate-500">Tổng {total} danh mục</span>,
        }}
      />

      <Modal
        title={editingItem ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText={editingItem ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        width={480}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ isPublic: true, color: '#E53E3E' }}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="Ví dụ: Ăn gì hôm nay" size="large" className="!rounded-lg" />
          </Form.Item>
          <Form.Item name="color" label="Màu đại diện">
            <ColorPicker showText />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về danh mục..." />
          </Form.Item>
          <Form.Item name="isPublic" label="Công khai cho tất cả người dùng" valuePropName="checked">
            <Switch checkedChildren="Công khai" unCheckedChildren="Riêng tư" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
