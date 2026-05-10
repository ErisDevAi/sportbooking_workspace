"use client";
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  ColorPicker,
  Switch,
  Spin,
  Empty,
  App,
} from "antd";
import { PlusOutlined, ArrowLeftOutlined, LogoutOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { categoriesApi } from "@/api/categories";
import type { Category } from "@/types/category";

export default function CategoriesPage() {
  const router = useRouter();
  const { message, modal } = App.useApp();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesApi.getAll();
      setCategories(res.data.data);
    } catch {
      message.error("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showAddModal = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (item: Category, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(item._id);
    form.setFieldsValue({
      name: item.name,
      icon: item.icon,
      color: item.color,
      description: item.description,
      isPublic: item.isPublic,
    });
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    const hexColor =
      typeof values.color === "string"
        ? values.color
        : values.color?.toHexString() || "#7C3AED";

    const payload = { ...values, color: hexColor };

    try {
      setSubmitting(true);
      if (editingId) {
        await categoriesApi.update(editingId, payload);
        message.success("Cập nhật danh mục thành công");
      } else {
        await categoriesApi.create(payload);
        message.success("Tạo danh mục thành công");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch {
      message.error("Thao tác thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa danh mục này? Tất cả lựa chọn bên trong cũng sẽ bị xóa.",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await categoriesApi.delete(id);
          message.success("Xóa danh mục thành công");
          fetchCategories();
        } catch {
          message.error("Xóa thất bại");
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeftOutlined className="text-lg" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Danh mục quyết định</h1>
              <p className="text-sm text-slate-500">Quản lý các thư mục phân loại quyết định</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} size="large" className="!rounded-lg !font-semibold">
              Tạo danh mục
            </Button>
            {user && (
              <Button
                icon={<LogoutOutlined />}
                onClick={() => { logout(); router.push('/'); }}
                size="large"
                className="!rounded-lg"
              >
                Đăng xuất
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {categories.length === 0 ? (
          <Empty
            description="Chưa có danh mục nào"
            className="py-20"
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
              Tạo danh mục đầu tiên
            </Button>
          </Empty>
        ) : (
          <Row gutter={[20, 20]}>
            {categories.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                <Link href={`/categories/${item._id}`} className="block">
                  <div
                    className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Color bar */}
                    <div className="h-2" style={{ backgroundColor: item.color }} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-3xl">{item.icon || "📁"}</span>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 rounded-full px-2 py-1">
                          {item.choiceCount || 0} lựa chọn
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-base mb-1">{item.name}</h3>
                      {item.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.isPublic ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                          {item.isPublic ? "Công khai" : "Riêng t��"}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => showEditModal(item, e)}
                            className="text-xs text-blue-500 hover:text-blue-700 font-semibold"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={(e) => handleDelete(item._id, e)}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Modal */}
      <Modal
        title={editingId ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText={editingId ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ isPublic: true, color: "#7C3AED" }}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input placeholder="Ví dụ: Ăn gì hôm nay" size="large" />
          </Form.Item>
          <Form.Item name="icon" label="Biểu tượng (emoji)">
            <Input placeholder="Ví dụ: 🍔" size="large" />
          </Form.Item>
          <Form.Item name="color" label="Màu sắc">
            <ColorPicker showText />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về danh mục này..." />
          </Form.Item>
          <Form.Item name="isPublic" label="Công khai cho mọi người" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
