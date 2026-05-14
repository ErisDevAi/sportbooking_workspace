"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Row, Col, Button, Modal, Form, Input, ColorPicker, Switch, Spin, Empty, App,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined, AppstoreOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/SplashScreen";
import TourGuide, { type TourGuideHandle } from "@/components/TourGuide";
import { categoriesApi } from "@/api/categories";
import { getCategoryIcon } from "@/utils/categoryIcons";
import type { Category } from "@/types/category";

export default function CategoriesPage() {
  const router = useRouter();
  const { message, modal } = App.useApp();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const tourRef = useRef<TourGuideHandle>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesApi.getAll();
      setCategories(res.data.data);
    } catch { message.error("Không thể tải danh mục"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const showAddModal = () => { setEditingId(null); form.resetFields(); setIsModalOpen(true); };
  const showEditModal = (item: Category, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setEditingId(item._id);
    form.setFieldsValue({ name: item.name, color: item.color, description: item.description, isPublic: item.isPublic });
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    const hexColor = typeof values.color === "string" ? values.color : values.color?.toHexString() || "#E53E3E";
    const payload = { ...values, color: hexColor };
    try {
      setSubmitting(true);
      if (editingId) { await categoriesApi.update(editingId, payload); message.success("Cập nhật danh mục thành công"); }
      else { await categoriesApi.create(payload); message.success("Tạo danh mục thành công"); }
      setIsModalOpen(false);
      fetchCategories();
    } catch { message.error("Thao tác thất bại"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    modal.confirm({
      title: "Xác nhận xóa", content: "Bạn có chắc chắn muốn xóa danh mục này?",
      okText: "Xóa", cancelText: "Hủy", okType: "danger",
      onOk: async () => {
        try { await categoriesApi.delete(id); message.success("Xóa thành công"); fetchCategories(); }
        catch { message.error("Xóa thất bại"); }
      },
    });
  };

  return (
    <>
    <SplashScreen ready={!loading} />
    <TourGuide ref={tourRef} page="categories" />
    <div>
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Danh mục quyết định</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-slate-500">Quản lý các chủ đề quyết định của bạn</p>
            <button type="button" onClick={() => tourRef.current?.start()} className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors cursor-pointer border-0">Hướng dẫn</button>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
          size="large"
          data-tour="create-cat-btn"
          className="!rounded-full !font-bold !px-6 !bg-red-500 !border-red-500 hover:!bg-red-600 !shadow-lg !shadow-red-200/50"
        >
          Tạo danh mục
        </Button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4"><AppstoreOutlined className="text-slate-300" /></div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">Chưa có danh mục nào</h3>
            <p className="text-slate-500 text-sm mb-6">Tạo danh mục đầu tiên để bắt đầu sử dụng vòng quay</p>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showAddModal}
              size="large"
              className="!rounded-full !font-bold !bg-red-500 !border-red-500 hover:!bg-red-600"
            >
              Tạo danh mục đầu tiên
            </Button>
          </div>
        ) : (
          <Row gutter={[20, 20]} className="grid-stagger">
            {categories.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                <Link href={`/categories/${item._id}`} className="block">
                  <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-scale-in">
                    <div className="h-1.5 rounded-t-2xl" style={{ backgroundColor: item.color }} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-3xl">{getCategoryIcon(item.name, item.slug)}</span>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 rounded-full px-2.5 py-1">{item.choiceCount || 0} mục</span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-base mb-1">{item.name}</h3>
                      {item.description && <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${item.isPublic ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                          {item.isPublic ? "Công khai" : "Riêng tư"}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => showEditModal(item, e)}
                            className="btn-action btn-action-edit"
                          >
                            <EditOutlined className="text-[10px]" /> Sửa
                          </button>
                          <button
                            onClick={(e) => handleDelete(item._id, e)}
                            className="btn-action btn-action-delete"
                          >
                            <DeleteOutlined className="text-[10px]" /> Xóa
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

      <Modal
        title={editingId ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        okText={editingId ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        centered
        width={440}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ isPublic: true, color: "#E53E3E" }} className="mt-4">
          <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: "Vui lòng nhập tên" }]}><Input placeholder="Ví dụ: Ăn gì hôm nay" size="large" className="!rounded-lg" /></Form.Item>
          <Form.Item name="color" label="Màu sắc"><ColorPicker showText /></Form.Item>
          <Form.Item name="description" label="Mô tả"><Input.TextArea rows={3} placeholder="Mô tả ngắn gọn..." className="!rounded-lg" /></Form.Item>
          <Form.Item name="isPublic" label="Công khai cho mọi người" valuePropName="checked"><Switch /></Form.Item>
        </Form>
      </Modal>
    </div>
    </>
  );
}
