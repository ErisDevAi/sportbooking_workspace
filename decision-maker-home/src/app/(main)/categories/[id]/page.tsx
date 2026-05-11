"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Spin, Empty, Modal, Form, Input, InputNumber, ColorPicker, App } from "antd";
import { ArrowLeftOutlined, PlusOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { categoriesApi } from "@/api/categories";
import { wheelContentsApi } from "@/api/wheel-contents";
import type { Category } from "@/types/category";
import type { WheelContent } from "@/types/wheel-contents";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { message, modal } = App.useApp();
  const id = params.id as string;
  const [form] = Form.useForm();
  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<WheelContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WheelContent | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, itemsRes] = await Promise.all([
        categoriesApi.getById(id),
        wheelContentsApi.getForWheel(id),
      ]);
      setCategory(catRes.data.data);
      setItems(itemsRes.data.data);
    } catch {
      message.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const showAddModal = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (item: WheelContent) => {
    setEditingItem(item);
    form.setFieldsValue({
      label: item.label,
      description: item.description,
      color: item.color,
      weight: item.weight,
    });
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    const hexColor =
      typeof values.color === "string"
        ? values.color
        : values.color?.toHexString() || "#7C3AED";

    const formData = new FormData();
    formData.append("label", values.label);
    formData.append("color", hexColor);
    formData.append("weight", String(values.weight || 1));
    formData.append("categoryId", id);
    if (values.description) formData.append("description", values.description);

    try {
      setSubmitting(true);
      if (editingItem) {
        await wheelContentsApi.update(editingItem._id, formData);
        message.success("Cập nhật thành công");
      } else {
        await wheelContentsApi.create(formData);
        message.success("Thêm lựa chọn thành công");
      }
      setIsModalOpen(false);
      fetchData();
    } catch {
      message.error("Thao tác thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (itemId: string) => {
    modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa lựa chọn này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await wheelContentsApi.delete(itemId);
          message.success("Đã xóa");
          fetchData();
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

  if (!category) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <Empty description="Không tìm thấy danh mục" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeftOutlined className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{category.icon || "📁"}</span>
            <div>
              <h1 className="text-lg font-bold text-slate-800">{category.name}</h1>
              <p className="text-xs text-slate-500">{items.length} lựa chọn</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button icon={<PlusOutlined />} onClick={showAddModal} className="!rounded-lg">
            Thêm
          </Button>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => router.push(`/wheels?category=${id}`)}
            className="!rounded-lg !font-semibold"
            disabled={items.length < 2}
          >
            Quay ngay
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {category.description && (
          <p className="text-slate-500 mb-6 text-sm">{category.description}</p>
        )}

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">Chưa có lựa chọn nào</h3>
            <p className="text-slate-500 text-sm mb-6">Thêm ít nhất 2 lựa chọn để bắt đầu quay</p>
            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} size="large">
              Thêm lựa chọn đầu tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <h4 className="font-semibold text-slate-800">{item.label}</h4>
                    {item.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 rounded-full px-3 py-1">
                    x{item.weight}
                  </span>
                  <button
                    onClick={() => showEditModal(item)}
                    className="text-xs text-blue-500 hover:text-blue-700 font-semibold"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        title={editingItem ? "Sửa lựa chọn" : "Thêm lựa chọn mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText={editingItem ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ weight: 1, color: "#7C3AED" }}
          className="mt-4"
        >
          <Form.Item
            name="label"
            label="Tên lựa chọn"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input placeholder="Ví dụ: Ăn phở" size="large" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (tùy chọn)">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn..." />
          </Form.Item>
          <Form.Item name="color" label="Màu sắc trên vòng quay">
            <ColorPicker showText />
          </Form.Item>
          <Form.Item
            name="weight"
            label="Trọng số (xác suất)"
            tooltip="Trọng số càng cao, xác suất được chọn càng lớn"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={10} style={{ width: "100%" }} size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
