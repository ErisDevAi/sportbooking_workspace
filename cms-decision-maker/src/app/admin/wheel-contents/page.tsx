'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  ColorPicker,
  Tag,
  Space,
  Switch,
  Popconfirm,
  Empty,
  App,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { wheelContentsApi } from '@/api/wheel-contents';
import { categoriesApi } from '@/api/categories';
import type { WheelContent } from '@/types/wheel-contents';
import type { Category } from '@/types/category';

export default function WheelContentsPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [items, setItems] = useState<WheelContent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WheelContent | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.getAll();
      setCategories(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedCategory(res.data.data[0]._id);
      }
    } catch {
      message.error('Không thể tải danh mục');
    }
  };

  const fetchItems = async (categoryId: string, page = 1, limit = 10) => {
    if (!categoryId) return;
    try {
      setLoading(true);
      const res = await wheelContentsApi.getAll(categoryId, page, limit);
      setItems(res.data.data);
      if (res.data.meta) {
        setPagination({
          current: res.data.meta.page,
          pageSize: res.data.meta.limit,
          total: res.data.meta.total,
        });
      }
    } catch {
      message.error('Không thể tải nội dung');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchItems(selectedCategory);
    }
  }, [selectedCategory]);

  const showCreateModal = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({ categoryId: selectedCategory, weight: 1 });
    setIsModalOpen(true);
  };

  const showEditModal = (item: WheelContent) => {
    setEditingItem(item);
    form.setFieldsValue({
      label: item.label,
      description: item.description,
      color: item.color,
      weight: item.weight,
      categoryId: item.categoryId,
      isActive: item.isActive,
    });
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    const hexColor =
      typeof values.color === 'string'
        ? values.color
        : values.color?.toHexString() || '#E53E3E';

    const formData = new FormData();
    formData.append('label', values.label);
    formData.append('color', hexColor);
    formData.append('weight', String(values.weight || 1));
    formData.append('categoryId', values.categoryId);
    if (values.description) formData.append('description', values.description);
    formData.append('isActive', String(values.isActive ?? true));

    try {
      setSubmitting(true);
      if (editingItem) {
        await wheelContentsApi.update(editingItem._id, formData);
        message.success('Cập nhật thành công');
      } else {
        await wheelContentsApi.create(formData);
        message.success('Tạo thành công');
      }
      setIsModalOpen(false);
      fetchItems(selectedCategory, pagination.current, pagination.pageSize);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await wheelContentsApi.delete(id);
      message.success('Xóa thành công');
      fetchItems(selectedCategory, pagination.current, pagination.pageSize);
    } catch {
      message.error('Xóa thất bại');
    }
  };

  const selectedCatInfo = categories.find((c) => c._id === selectedCategory);

  const columns = [
    {
      title: 'Lựa chọn',
      key: 'item',
      render: (_: any, record: WheelContent) => (
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full shrink-0 border" style={{ backgroundColor: record.color }} />
          <div>
            <p className="font-semibold text-slate-800">{record.label}</p>
            {record.description && <p className="text-xs text-slate-400">{record.description}</p>}
          </div>
        </div>
      ),
    },
    {
      title: 'Trọng số',
      dataIndex: 'weight',
      key: 'weight',
      width: 100,
      render: (weight: number) => (
        <Tag color="red" className="!font-bold">x{weight}</Tag>
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
          <span className={`text-sm ${isActive ? 'text-green-600' : 'text-slate-400'}`}>
            {isActive ? 'Hoạt động' : 'Ẩn'}
          </span>
        </div>
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
      render: (_: any, record: WheelContent) => (
        <Space>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => showEditModal(record)} className="!text-blue-500" />
          <Popconfirm
            title="Xóa lựa chọn này?"
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
          <h1 className="text-xl font-bold text-slate-800">Nội dung vòng quay</h1>
          <p className="text-sm text-slate-500 mt-0.5">Quản lý các lựa chọn hiển thị trên vòng quay</p>
        </div>
        <div className="flex gap-3">
          <Select
            value={selectedCategory || undefined}
            onChange={setSelectedCategory}
            placeholder="Chọn danh mục"
            className="!w-[200px]"
            size="large"
          >
            {categories.map((cat) => (
              <Select.Option key={cat._id} value={cat._id}>
                <AppstoreOutlined /> {cat.name}
              </Select.Option>
            ))}
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal} className="!rounded-lg !font-semibold" size="large">
            Thêm lựa chọn
          </Button>
        </div>
      </div>

      {/* Category info banner */}
      {selectedCatInfo && (
        <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4 flex items-center gap-3">
          <span className="text-2xl">{selectedCatInfo.icon}</span>
          <div>
            <p className="font-semibold text-slate-700">{selectedCatInfo.name}</p>
            <p className="text-xs text-slate-500">{selectedCatInfo.description || 'Không có mô tả'}</p>
          </div>
          <Tag className="ml-auto" color="blue">{items.length} lựa chọn</Tag>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={items}
        rowKey="_id"
        loading={loading}
        locale={{ emptyText: <Empty description="Chưa có lựa chọn nào trong danh mục này" /> }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => <span className="text-sm text-slate-500">Tổng {total} lựa chọn</span>,
          onChange: (page, pageSize) => fetchItems(selectedCategory, page, pageSize),
        }}
      />

      <Modal
        title={editingItem ? 'Sửa lựa chọn' : 'Thêm lựa chọn mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText={editingItem ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        width={480}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ weight: 1, isActive: true, categoryId: selectedCategory }}
          className="mt-4"
        >
          <Form.Item
            name="label"
            label="Tên lựa chọn"
            rules={[{ required: true, message: 'Vui lòng nhập tên lựa chọn' }]}
          >
            <Input placeholder="Ví dụ: Ăn phở, Đi gym, Học tiếng Anh..." size="large" className="!rounded-lg" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (tùy chọn)">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn gọn..." />
          </Form.Item>
          <Form.Item name="color" label="Màu sắc trên vòng quay">
            <ColorPicker showText />
          </Form.Item>
          <Form.Item
            name="weight"
            label="Trọng số"
            tooltip="Trọng số càng cao → xác suất được chọn càng lớn"
            rules={[{ required: true, message: 'Vui lòng nhập trọng số' }]}
          >
            <InputNumber min={1} max={10} style={{ width: '100%' }} size="large" />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Thuộc danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select size="large">
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  <AppstoreOutlined /> {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
