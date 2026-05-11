"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Spin, Modal, Form, Input, InputNumber, ColorPicker, App } from "antd";
import { ArrowLeftOutlined, PlusOutlined, PlayCircleOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import SplashScreen from "@/components/SplashScreen";
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

  useEffect(() => { fetchData(); }, [id]);

  const showAddModal = () => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); };
  const showEditModal = (item: WheelContent) => {
    setEditingItem(item);
    form.setFieldsValue({ label: item.label, description: item.description, color: item.color, weight: item.weight });
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    const hexColor = typeof values.color === "string" ? values.color : values.color?.toHexString() || "#E53E3E";
    const formData = new FormData();
    formData.append("label", values.label);
    formData.append("color", hexColor);
    formData.append("weight", String(values.weight || 1));
    formData.append("categoryId", id);
    if (values.description) formData.append("description", values.description);
    try {
      setSubmitting(true);
      if (editingItem) { await wheelContentsApi.update(editingItem._id, formData); message.success("Cập nhật thành công"); }
      else { await wheelContentsApi.create(formData); message.success("Thêm lựa chọn thành công"); }
      setIsModalOpen(false);
      fetchData();
    } catch { message.error("Thao tác thất bại"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = (itemId: string) => {
    modal.confirm({
      title: "Xác nhận xóa", content: "Bạn có chắc muốn xóa lựa chọn này?",
      okText: "Xóa", cancelText: "Hủy", okType: "danger",
      onOk: async () => {
        try { await wheelContentsApi.delete(itemId); message.success("Đã xóa"); fetchData(); }
        catch { message.error("Xóa thất bại"); }
      },
    });
  };

  if (!loading && !category) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <div className="text-6xl">🔍</div>
        <p className="text-slate-500 font-medium">Không tìm thấy danh mục</p>
        <Button onClick={() => router.push('/categories')} className="!rounded-full">Quay lại</Button>
      </div>
    );
  }

  return (
    <>
    <SplashScreen ready={!loading} />
    {category && <div>
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
              <ArrowLeftOutlined />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: category.color + '15' }}>
                {category.icon || "📁"}
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-800">{category.name}</h1>
                <p className="text-xs text-slate-400 font-medium">{items.length} lựa chọn</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              icon={<PlusOutlined />}
              onClick={showAddModal}
              className="!rounded-full !font-semibold"
            >
              Thêm
            </Button>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => router.push(`/wheels?category=${id}`)}
              className="!rounded-full !font-bold !bg-red-500 !border-red-500 hover:!bg-red-600 !shadow-lg !shadow-red-200/50"
              disabled={items.length < 2}
            >
              Quay ngay
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {category.description && (
          <p className="text-slate-500 mb-6 text-sm bg-white rounded-2xl border border-slate-100 p-4">{category.description}</p>
        )}

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">Chưa có lựa chọn nào</h3>
            <p className="text-slate-500 text-sm mb-6">Thêm ít nhất 2 lựa chọn để bắt đầu quay</p>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showAddModal}
              size="large"
              className="!rounded-full !font-bold !bg-red-500 !border-red-500 hover:!bg-red-600"
            >
              Thêm lựa chọn đầu tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color }} />
                  <div>
                    <h4 className="font-bold text-slate-800">{item.label}</h4>
                    {item.description && <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-500 bg-red-50 rounded-full px-3 py-1">
                    x{item.weight}
                  </span>
                  <button
                    onClick={() => showEditModal(item)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <EditOutlined className="text-[10px]" /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <DeleteOutlined className="text-[10px]" /> Xóa
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
        centered
        width={440}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ weight: 1, color: "#E53E3E" }} className="mt-4">
          <Form.Item name="label" label="Tên lựa chọn" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
            <Input placeholder="Ví dụ: Ăn phở" size="large" className="!rounded-lg" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (tùy chọn)">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn..." className="!rounded-lg" />
          </Form.Item>
          <Form.Item name="color" label="Màu sắc trên vòng quay">
            <ColorPicker showText />
          </Form.Item>
          <Form.Item name="weight" label="Trọng số (xác suất)" tooltip="Trọng số càng cao, xác suất được chọn càng lớn" rules={[{ required: true }]}>
            <InputNumber min={1} max={10} style={{ width: "100%" }} size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>}
    </>
  );
}
