'use client';

import { useState } from 'react';
import {
  Select,
  Button,
  Modal,
  Typography,
  Statistic,
  Space,
  Rate,
  Upload,
  Input,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// ===== MOCK DATA =====
const mockCategories = [
  { _id: '1', name: 'Ăn gì', icon: '🍔' },
  { _id: '2', name: 'Làm gì', icon: '🎯' },
];

const mockItemsByCategory: Record<string, any[]> = {
  '1': [
    {
      _id: 'w1',
      label: 'Ăn phở',
      color: '#E74C3C',
      weight: 1,
      description: 'Phở bò tái chín',
    },
    {
      _id: 'w2',
      label: 'Ăn bún chả',
      color: '#3498DB',
      weight: 2,
      description: 'Bún chả Hàng Mành',
    },
    {
      _id: 'w3',
      label: 'Ăn pizza',
      color: '#2ECC71',
      weight: 1,
      description: 'Pizza hải sản',
    },
  ],
  '2': [
    {
      _id: 'w4',
      label: 'Đi gym',
      color: '#F39C12',
      weight: 2,
      description: 'Tập 45 phút',
    },
    {
      _id: 'w5',
      label: 'Xem phim',
      color: '#9B59B6',
      weight: 3,
      description: 'Netflix and chill',
    },
  ],
};

const mockStreak = {
  currentStreak: 3,
  maxStreak: 7,
  totalSpins: 25,
};

export default function SpinPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showCheckin, setShowCheckin] = useState(false);

  const selectedCategoryInfo = mockCategories.find(
    (category) => category._id === selectedCategory
  );

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setResult(null);
    setRotation(0);

    const categoryItems = mockItemsByCategory[catId] || [];
    setItems(categoryItems);
  };

  const getWheelGradient = () => {
    if (items.length === 0) {
      return 'conic-gradient(#7C3AED 0deg 90deg, #EC4899 90deg 180deg, #F59E0B 180deg 270deg, #10B981 270deg 360deg)';
    }

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const parts: string[] = [];
    let current = 0;

    items.forEach((item) => {
      const angle = (item.weight / totalWeight) * 360;

      parts.push(`${item.color} ${current}deg ${current + angle}deg`);

      current += angle;
    });

    return `conic-gradient(${parts.join(', ')})`;
  };

  const handleSpin = () => {
    if (isSpinning || items.length < 2) return;

    setIsSpinning(true);
    setResult(null);

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let rand = Math.random() * totalWeight;
    let selectedIndex = 0;

    for (let i = 0; i < items.length; i++) {
      rand -= items[i].weight;

      if (rand <= 0) {
        selectedIndex = i;
        break;
      }
    }

    let targetAngle = 0;

    for (let i = 0; i < selectedIndex; i++) {
      targetAngle += (items[i].weight / totalWeight) * 360;
    }

    targetAngle += ((items[selectedIndex].weight / totalWeight) * 360) / 2;

    const spins = 360 * 5;
    const stopAngle = 360 - targetAngle;
    const totalRotation = rotation + spins + stopAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      setResult(items[selectedIndex]);
      setIsSpinning(false);
    }, 4200);
  };

  const handleAccept = () => {
    if (!result) return;

    message.success(`Đã chọn: ${result.label}! 🔥`);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-800 px-4 py-8 text-white">
      <div className="relative mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-fit rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold backdrop-blur">
            Decision Maker Platform
          </div>

          <Title
            level={1}
            style={{
              color: '#fff',
              fontWeight: 900,
            }}
          >
            🎰 Vòng quay quyết định
          </Title>
        </div>

        {/* STREAK */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white/95 p-5 text-center text-slate-900 shadow-xl">
            <Statistic
              title="🔥 Streak"
              value={mockStreak.currentStreak}
              suffix="ngày"
            />
          </div>

          <div className="rounded-3xl bg-white/95 p-5 text-center text-slate-900 shadow-xl">
            <Statistic
              title="🏆 Kỷ lục"
              value={mockStreak.maxStreak}
              suffix="ngày"
            />
          </div>

          <div className="rounded-3xl bg-white/95 p-5 text-center text-slate-900 shadow-xl">
            <Statistic title="🎯 Tổng quay" value={mockStreak.totalSpins} />
          </div>
        </div>

        <div className="grid gap-8 rounded-[32px] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT */}
          <div className="space-y-5">
            {/* CATEGORY */}
            <div className="rounded-[28px] bg-white/95 p-5 text-slate-900 shadow-xl">
              <h2 className="text-2xl font-extrabold">Chọn danh mục</h2>

              <Select
                placeholder="Chọn danh mục..."
                className="mt-5 w-full"
                onChange={handleSelectCategory}
                size="large"
                value={selectedCategory || undefined}
              >
                {mockCategories.map((cat) => (
                  <Select.Option key={cat._id} value={cat._id}>
                    {cat.icon} {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {/* LIST */}
            <div className="rounded-[28px] bg-white/95 p-5 text-slate-900 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-extrabold">Danh sách lựa chọn</h2>

                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-purple-700">
                  {items.length} mục
                </span>
              </div>

              {items.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                  <p className="text-4xl">🧭</p>

                  <p className="mt-3 font-bold text-slate-600">
                    Chưa chọn danh mục
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-4 w-4 rounded-full"
                          style={{
                            backgroundColor: item.color,
                          }}
                        />

                        <div>
                          <p className="font-bold text-slate-800">
                            {item.label}
                          </p>

                          <p className="text-xs text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-600 shadow-sm">
                        x{item.weight}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-center justify-center rounded-[28px] bg-white/10 p-5 shadow-inner">
            <div className="mb-5 rounded-2xl bg-black/20 px-5 py-3 text-center">
              <p className="text-sm text-white/70">Khu vực vòng quay</p>

              <p className="text-lg font-bold">
                {selectedCategoryInfo
                  ? `${selectedCategoryInfo.icon} ${selectedCategoryInfo.name}`
                  : 'Chưa chọn danh mục'}
              </p>
            </div>

            {/* WHEEL */}
            <div className="relative mb-8 h-[320px] w-[320px] md:h-[380px] md:w-[380px]">
              {/* POINTER */}
              <div
                className="absolute left-1/2 top-[-12px] z-20 -translate-x-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '16px solid transparent',
                  borderRight: '16px solid transparent',
                  borderTop: '32px solid #FACC15',
                }}
              />

              <div
                className="relative h-full w-full rounded-full border-[8px] border-white"
                style={{
                  background: getWheelGradient(),
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning
                    ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                    : 'none',
                }}
              >
                {/* LABELS */}
                {items.map((item, index) => {
                  const totalWeight = items.reduce(
                    (sum, currentItem) => sum + currentItem.weight,
                    0
                  );

                  let startAngle = 0;

                  for (let i = 0; i < index; i++) {
                    startAngle += (items[i].weight / totalWeight) * 360;
                  }

                  const sliceAngle = (item.weight / totalWeight) * 360;
                  const midAngle = startAngle + sliceAngle / 2;
                  const rad = (midAngle * Math.PI) / 180;
                  const radius = 125;

                  return (
                    <div
                      key={item._id}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) translate(${
                          Math.sin(rad) * radius
                        }px, ${-Math.cos(rad) * radius}px) rotate(${midAngle}deg)`,
                        fontSize: 12,
                        fontWeight: 900,
                        color: '#fff',
                        textShadow: '1px 2px 4px rgba(0,0,0,0.8)',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        maxWidth: 100,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.label}
                    </div>
                  );
                })}

                {/* CENTER */}
                <div className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[6px] border-slate-900 bg-white text-lg font-black text-slate-900 shadow-xl">
                  GO
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <Button
              type="primary"
              size="large"
              onClick={handleSpin}
              disabled={isSpinning || items.length < 2}
              className="!h-14 !min-w-[240px] !rounded-full !bg-gradient-to-r !from-yellow-300 !via-orange-400 !to-pink-500 !text-lg !font-black !text-slate-950"
            >
              {isSpinning ? '⏳ Đang quay...' : '🎰 QUAY NGAY!'}
            </Button>

            {items.length < 2 && (
              <div className="mt-4 rounded-2xl bg-yellow-100 px-5 py-3 text-sm font-bold text-yellow-900">
                Cần ít nhất 2 lựa chọn để quay
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RESULT MODAL */}
      <Modal open={!!result} onCancel={() => setResult(null)} footer={null} centered>
        {result && (
          <div className="text-center">
            <Title level={3}>{result.label}</Title>

            <Text type="secondary">{result.description}</Text>

            <div className="mt-5">
              <Space>
                <Button type="primary" onClick={handleAccept}>
                  ✅ Chấp nhận
                </Button>

                <Button onClick={() => setResult(null)}>🔄 Quay lại</Button>
              </Space>
            </div>

            <div className="mt-4">
              <Button
                type="link"
                onClick={() => {
                  setResult(null);
                  setShowCheckin(true);
                }}
              >
                📸 Check-in ngay
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* CHECKIN MODAL */}
      <Modal
        title="📸 Check-in xác nhận"
        open={showCheckin}
        onCancel={() => setShowCheckin(false)}
        footer={null}
        centered
      >
        <div className="py-2">
          <Upload
            listType="picture-card"
            maxCount={1}
            accept="image/*"
            beforeUpload={() => false}
          >
            <div>
              <UploadOutlined />

              <div
                style={{
                  marginTop: 4,
                }}
              >
                Upload
              </div>
            </div>
          </Upload>

          <div className="mt-4">
            <Rate />
          </div>

          <Input.TextArea
            rows={3}
            placeholder="Hôm nay thế nào?"
            maxLength={500}
            showCount
            className="mt-4"
          />

          <Button
            type="primary"
            block
            size="large"
            className="mt-4"
            onClick={() => {
              message.success('Check-in thành công! 🎉');
              setShowCheckin(false);
            }}
          >
            ✅ Hoàn thành Check-in
          </Button>
        </div>
      </Modal>
    </div>
  );
}