'use client';

import { useState } from 'react';
import { Wheel } from 'react-custom-roulette';

export default function WheelPage() {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [result, setResult] = useState('');

  const defaultWheelData = [
    { option: 'Nhập lựa chọn' },
    { option: 'Thêm dữ liệu' },
    { option: 'Quay thử nhé' },
    { option: 'Decision' },
    { option: 'Maker' },
    { option: '🎯' },
  ];

  const wheelData =
    items.length > 0
      ? items.map((item) => ({ option: item }))
      : defaultWheelData;

  const addItem = () => {
    const value = inputValue.trim();

    if (!value) return;

    setItems([...items, value]);
    setInputValue('');
    setResult('');
  };

  const spinWheel = () => {
    if (items.length === 0) {
      alert('Bạn cần nhập ít nhất 1 lựa chọn trước khi quay!');
      return;
    }

    const randomIndex = Math.floor(Math.random() * items.length);

    setPrizeNumber(randomIndex);
    setMustSpin(true);
    setResult('');
  };

  const handleStopSpinning = () => {
    const selectedItem = items[prizeNumber];

    setResult(selectedItem);
    setMustSpin(false);

    setItems((prev) => prev.filter((_, index) => index !== prizeNumber));
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const resetWheel = () => {
    setItems([]);
    setResult('');
    setInputValue('');
    setPrizeNumber(0);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-800 px-5 py-8 text-white">
      <div className="pointer-events-none fixed left-[-80px] top-[-80px] h-72 w-72 rounded-full bg-pink-400/30 blur-3xl" />
      <div className="pointer-events-none fixed bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-yellow-300/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-fit rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold backdrop-blur">
            Decision Maker App
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Vòng quay quyết định 🎯
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/75 md:text-base">
            Nhập các lựa chọn bạn đang phân vân, hệ thống sẽ quay và chọn giúp bạn.
            Sau khi trúng, lựa chọn đó sẽ tự động biến mất khỏi vòng quay.
          </p>
        </div>

        <div className="grid gap-8 rounded-[32px] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr] md:p-8">
          <div className="flex flex-col items-center justify-center rounded-[28px] bg-white/10 p-6 shadow-inner">
            <div className="mb-5 rounded-2xl bg-black/20 px-5 py-3 text-center">
              <p className="text-sm text-white/70">Trạng thái vòng quay</p>
              <p className="text-lg font-bold">
                {items.length > 0
                  ? `${items.length} lựa chọn đang chờ`
                  : 'Đang hiển thị dữ liệu mẫu'}
              </p>
            </div>

            <div className="rounded-full bg-white p-4 shadow-[0_0_60px_rgba(255,255,255,0.35)]">
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={items.length > 0 ? prizeNumber : 0}
                data={wheelData}
                backgroundColors={[
                  '#FF6B6B',
                  '#4ECDC4',
                  '#45B7D1',
                  '#FFA502',
                  '#9B59B6',
                  '#2ECC71',
                ]}
                textColors={['#ffffff']}
                outerBorderColor="#111827"
                outerBorderWidth={5}
                radiusLineColor="#ffffff"
                radiusLineWidth={2}
                fontSize={15}
                onStopSpinning={handleStopSpinning}
              />
            </div>

            <button
              onClick={spinWheel}
              disabled={mustSpin}
              className="mt-8 rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 px-10 py-4 text-lg font-extrabold text-gray-950 shadow-xl transition hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mustSpin ? 'Đang quay...' : 'Quay ngay 🎰'}
            </button>

            {result && (
              <div className="mt-6 w-full max-w-md rounded-3xl border border-green-300/40 bg-green-400/20 p-5 text-center shadow-xl">
                <p className="text-sm font-medium text-green-100">
                  Kết quả được chọn
                </p>
                <p className="mt-2 text-3xl font-extrabold text-white">
                  {result}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="rounded-[28px] border border-white/15 bg-white/95 p-5 text-gray-900 shadow-xl">
              <h2 className="text-2xl font-extrabold">Thêm lựa chọn</h2>
              <p className="mt-1 text-sm text-gray-500">
                Ví dụ: Phở, Bún chả, Đi cafe, Làm bài tập...
              </p>

              <div className="mt-5 flex gap-3">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addItem();
                  }}
                  placeholder="Nhập lựa chọn..."
                  className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                />

                <button
                  onClick={addItem}
                  className="rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-purple-700"
                >
                  Thêm
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/15 bg-white/95 p-5 text-gray-900 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold">
                    Danh sách lựa chọn
                  </h2>
                  <p className="text-sm text-gray-500">
                    Các ô sẽ xuất hiện trong vòng quay
                  </p>
                </div>

                {items.length > 0 && (
                  <button
                    onClick={resetWheel}
                    className="rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-500 transition hover:bg-red-100"
                  >
                    Xóa hết
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                  <p className="text-4xl">📝</p>
                  <p className="mt-3 font-semibold text-gray-600">
                    Chưa có lựa chọn nào
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Hãy nhập dữ liệu để vòng quay bắt đầu hoạt động.
                  </p>
                </div>
              ) : (
                <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                  {items.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-extrabold text-purple-700">
                          {index + 1}
                        </span>

                        <span className="font-semibold text-gray-700">
                          {item}
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(index)}
                        className="rounded-xl px-3 py-1 text-sm font-bold text-red-500 transition hover:bg-red-50"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}