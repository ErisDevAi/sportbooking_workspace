"use client";
import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  ColorPicker,
  Switch,
  Badge,
  Space,
  Tag,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import CardCat from "@/components/CardCat";

// Mock data ban đầu
const initialCategories = [
  {
    id: "1",
    name: "Học tập",
    icon: "📚",
    color: "#1677ff",
    isPublic: true,
    count: 3,
  },
  {
    id: "2",
    name: "Giải trí",
    icon: "🎮",
    color: "#52c41a",
    isPublic: true,
    count: 0,
  },
  {
    id: "3",
    name: "Sức khỏe",
    icon: "🍎",
    color: "#f5222d",
    isPublic: false,
    count: 5,
  },
];

export default function CategoriesPage() {
  const [form] = Form.useForm();
  const [data, setData] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Mở modal để tạo mới
  const showAddModal = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Mở modal để sửa
  const showEditModal = (item: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click vào card (chuyển trang)
    setEditingId(item.id);
    form.setFieldsValue({
      ...item,
      color: typeof item.color === "string" ? item.color : item.color, // Antd ColorPicker cần hex
    });
    setIsModalOpen(true);
  };

  const handleFinish = (values: any) => {
    const hexColor =
      typeof values.color === "string"
        ? values.color
        : values.color.toHexString();

    if (editingId) {
      // Logic Update
      setData(
        data.map((item) =>
          item.id === editingId
            ? { ...item, ...values, color: hexColor }
            : item,
        ),
      );
    } else {
      // Logic Create
      const newItem = {
        ...values,
        id: Date.now().toString(),
        count: 0,
        color: hexColor,
      };
      setData([...data, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa danh mục này?",
      onOk: () => setData(data.filter((item) => item.id !== id)),
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          Thêm mới
        </Button>
      </div>

      <Row gutter={[20, 20]}>
        {data.map((item) => (
          <Col xs={24} sm={12} md={8} key={item.id}>
            <CardCat
              id={item.id}
              icon={item.icon}
              count={item.count}
              isPublic={item.isPublic}
              color={item.color}
              name={item.name}
              type="category"
            />
          </Col>
        ))}
      </Row>

      <Modal
        title={editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ isPublic: true }}
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="icon" label="Emoji Icon">
            <Input placeholder="Ví dụ: 🍎" />
          </Form.Item>
          <Form.Item name="color" label="Màu sắc">
            <ColorPicker />
          </Form.Item>
          <Form.Item name="isPublic" label="Công khai" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
