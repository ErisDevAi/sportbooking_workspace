"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Row, Col, Button, Modal, Form, Input, ColorPicker, App,
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined,
  LockOutlined, GlobalOutlined, PlayCircleOutlined, CrownOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/SplashScreen";
import TourGuide, { type TourGuideHandle } from "@/components/TourGuide";
import { categoriesApi } from "@/api/categories";
import { getCategoryIcon } from "@/utils/categoryIcons";
import { useAuthStore } from "@/store/auth";
import type { Category } from "@/types/category";

export default function CategoriesPage() {
  const router = useRouter();
  const { message, modal } = App.useApp();
  const [form] = Form.useForm();
  const user = useAuthStore((s) => s.user);
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

  // Tách danh mục mặc định (hệ thống / công khai) và cá nhân
  const defaultCategories = useMemo(
    () => categories.filter((c) => c.isDefault || (c.isPublic && c.createdBy !== user?._id)),
    [categories, user],
  );
  const myCategories = useMemo(
    () => categories.filter((c) => {
      // createdBy có thể là string hoặc object {_id, name, email}
      const ownerId = typeof c.createdBy === 'object' ? (c.createdBy as any)?._id : c.createdBy;
      return ownerId === user?._id;
    }),
    [categories, user],
  );

  const isOwner = (cat: Category) => {
    const ownerId = typeof cat.createdBy === 'object' ? (cat.createdBy as any)?._id : cat.createdBy;
    return ownerId === user?._id;
  };

  const showAddModal = () => { setEditingId(null); form.resetFields(); setIsModalOpen(true); };
  const showEditModal = (item: Category, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setEditingId(item._id);
    form.setFieldsValue({ name: item.name, color: item.color, description: item.description });
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    const hexColor = typeof values.color === "string" ? values.color : values.color?.toHexString() || "#E53E3E";
    // User tạo danh mục luôn là riêng tư (isPublic: false)
    const payload = { ...values, color: hexColor, isPublic: false };
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
    e.preventDefault(); e.stopPropagation();
    modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa danh mục này? Tất cả lựa chọn trong danh mục cũng sẽ bị xóa.",
      okText: "Xóa", cancelText: "Hủy", okType: "danger",
      onOk: async () => {
        try { await categoriesApi.delete(id); message.success("Xóa thành công"); fetchCategories(); }
        catch { message.error("Xóa thất bại"); }
      },
    });
  };

  const CategoryCard = ({ item, showActions }: { item: Category; showActions: boolean }) => (
    <Link href={`/categories/${item._id}`} className="block">
      <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <div className="h-1.5 rounded-t-2xl" style={{ backgroundColor: item.color }} />
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-3xl">{getCategoryIcon(item.name, item.slug)}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 bg-slate-50 rounded-full px-2.5 py-1">
                {item.choiceCount || 0} mục
              </span>
            </div>
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">{item.name}</h3>
          {item.description && <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
              item.isDefault
                ? 'bg-amber-50 text-amber-600'
                : item.isPublic
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-slate-100 text-slate-500'
            }`}>
              {item.isDefault ? (
                <><CrownOutlined className="text-[9px]" /> Mặc định</>
              ) : item.isPublic ? (
                <><GlobalOutlined className="text-[9px]" /> Công khai</>
              ) : (
                <><LockOutlined className="text-[9px]" /> Riêng tư</>
              )}
            </span>
            {showActions && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => showEditModal(item, e)} className="btn-action btn-action-edit">
                  <EditOutlined className="text-[10px]" /> Sửa
                </button>
                {!item.isDefault && (
                  <button onClick={(e) => handleDelete(item._id, e)} className="btn-action btn-action-delete">
                    <DeleteOutlined className="text-[10px]" /> Xóa
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <>
    <SplashScreen ready={!loading} />
    <TourGuide ref={tourRef} page="categories" />
    <div>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Danh mục quyết định</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-slate-500">Khám phá danh mục có sẵn hoặc tạo danh mục riêng</p>
            <button type="button" onClick={() => tourRef.current?.start()} className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors cursor-pointer border-0">
              Hướng dẫn
            </button>
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

      <div className="max-w-6xl mx-auto px-4 py-6">
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4"><AppstoreOutlined className="text-slate-300" /></div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">Chưa có danh mục nào</h3>
            <p className="text-slate-500 text-sm mb-6">Tạo danh mục đầu tiên để bắt đầu sử dụng vòng quay</p>
            <Button
              type="primary" icon={<PlusOutlined />} onClick={showAddModal} size="large"
              className="!rounded-full !font-bold !bg-red-500 !border-red-500 hover:!bg-red-600"
            >
              Tạo danh mục đầu tiên
            </Button>
          </div>
        ) : (
          <>
            {/* Danh mục mặc định / hệ thống */}
            {defaultCategories.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-5">
                  <CrownOutlined className="text-amber-500" />
                  <h2 className="text-lg font-bold text-slate-800">Danh mục gợi ý</h2>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 rounded-full px-2.5 py-0.5">
                    {defaultCategories.length} danh mục
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-4">Danh mục được tạo sẵn bởi hệ thống, dùng chung cho mọi người</p>
                <Row gutter={[16, 16]}>
                  {defaultCategories.map((item) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                      <CategoryCard item={item} showActions={false} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Danh mục cá nhân */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <LockOutlined className="text-slate-400" />
                  <h2 className="text-lg font-bold text-slate-800">Danh mục của bạn</h2>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 rounded-full px-2.5 py-0.5">
                    {myCategories.length} danh mục
                  </span>
                </div>
                <Button icon={<PlusOutlined />} onClick={showAddModal} className="!rounded-lg !font-semibold !text-xs">
                  Tạo mới
                </Button>
              </div>

              {myCategories.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center">
                  <AppstoreOutlined className="text-4xl text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium mb-1">Bạn chưa tạo danh mục nào</p>
                  <p className="text-xs text-slate-400 mb-4">Tạo danh mục riêng để thêm lựa chọn tùy chỉnh</p>
                  <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}
                    className="!rounded-full !font-bold !bg-red-500 !border-red-500 hover:!bg-red-600"
                  >
                    Tạo danh mục đầu tiên
                  </Button>
                </div>
              ) : (
                <Row gutter={[16, 16]}>
                  {myCategories.map((item) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                      <CategoryCard item={item} showActions={true} />
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal tạo/sửa — KHÔNG có toggle isPublic */}
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
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ color: "#E53E3E" }} className="mt-4">
          <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
            <Input placeholder="Ví dụ: Ăn gì hôm nay, Đi đâu cuối tuần..." size="large" className="!rounded-lg" />
          </Form.Item>
          <Form.Item name="color" label="Màu sắc">
            <ColorPicker showText />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (tùy chọn)">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về danh mục này..." className="!rounded-lg" />
          </Form.Item>
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
            <LockOutlined className="text-slate-400" />
            Danh mục của bạn sẽ ở chế độ <span className="font-bold text-slate-700">riêng tư</span> — chỉ bạn mới thấy và sử dụng.
          </div>
        </Form>
      </Modal>
    </div>
    </>
  );
}
