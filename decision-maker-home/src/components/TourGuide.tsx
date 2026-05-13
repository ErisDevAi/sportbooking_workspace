'use client';

import { useState, useEffect, useCallback, useLayoutEffect, useRef } from 'react';
import { QuestionCircleOutlined, LeftOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import { createPortal } from 'react-dom';

const TOUR_KEY = 'dm_tour_done';
const TOOLTIP_W = 340;
const GAP = 14;
const PAD = 8;
const RADIUS = 14;

interface Step {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface Props {
  page: 'wheels' | 'home' | 'categories' | 'stats';
}

/* ── step definitions ─────────────────────────────── */

const STEPS: Record<string, Step[]> = {
  wheels: [
    { target: '[data-tour="category-select"]', title: 'Bước 1: Chọn danh mục 📂', content: 'Chọn một chủ đề quyết định: Ăn gì, Làm gì, Đi đâu... hoặc tạo danh mục riêng.', placement: 'bottom' },
    { target: '[data-tour="create-category"]', title: 'Tạo danh mục mới ✨', content: 'Nhấn nút này để tạo danh mục tùy chỉnh với tên, màu sắc và mô tả riêng.', placement: 'bottom' },
    { target: '[data-tour="item-list"]', title: 'Danh sách lựa chọn 📝', content: 'Đây là các lựa chọn trong danh mục. Thêm, sửa, xóa và điều chỉnh trọng số cho mỗi mục.', placement: 'bottom' },
    { target: '[data-tour="wheel"]', title: 'Bước 2: Vòng quay 🎡', content: 'Vòng quay hiển thị tất cả lựa chọn. Kích thước phần tương ứng với trọng số.', placement: 'bottom' },
    { target: '[data-tour="spin-button"]', title: 'Nhấn QUAY NGAY! 🚀', content: 'Nhấn nút này để quay. Hệ thống chọn kết quả ngẫu nhiên dựa trên trọng số.', placement: 'top' },
  ],
  home: [
    { target: '[data-tour="demo-wheel"]', title: 'Thử quay vòng quay 🎡', content: 'Đây là vòng quay demo. Chọn danh mục và nhấn QUAY để thử ngay!', placement: 'bottom' },
    { target: '[data-tour="quick-cards"]', title: 'Bắt đầu nhanh ⚡', content: 'Nhấn vào bất kỳ thẻ nào để bắt đầu ngay với chủ đề bạn quan tâm.', placement: 'top' },
  ],
  categories: [
    { target: '[data-tour="create-cat-btn"]', title: 'Tạo danh mục mới ✨', content: 'Nhấn nút này để tạo danh mục riêng: Ăn gì, Đi đâu, Học gì...', placement: 'bottom' },
  ],
  stats: [
    { target: '[data-tour="stats-cards"]', title: 'Tổng quan nhanh 📊', content: 'Xem nhanh streak hiện tại, kỷ lục, tổng lượt quay và ngày hoạt động.', placement: 'bottom' },
    { target: '[data-tour="calendar"]', title: 'Lịch hoạt động 📅', content: 'Nhấn vào mỗi ngày để xem chi tiết hoạt động.', placement: 'top' },
  ],
};

/* ── helpers ───────────────────────────────────────── */

/** Calculate tooltip fixed position so it sits next to the target. */
function calcPosition(
  targetRect: DOMRect,
  placement: string,
  tooltipH: number,
): { x: number; y: number; actualPlacement: string } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Try requested placement, fall back to 'bottom' if it doesn't fit
  let p = placement;

  const fits = {
    bottom: targetRect.bottom + GAP + tooltipH < vh,
    top: targetRect.top - GAP - tooltipH > 0,
    left: targetRect.left - GAP - TOOLTIP_W > 0,
    right: targetRect.right + GAP + TOOLTIP_W < vw,
  };

  if (!fits[p as keyof typeof fits]) {
    // fallback order
    const order = ['bottom', 'top', 'right', 'left'];
    p = order.find((d) => fits[d as keyof typeof fits]) || 'bottom';
  }

  let x = 0;
  let y = 0;

  switch (p) {
    case 'bottom':
      x = targetRect.left + targetRect.width / 2 - TOOLTIP_W / 2;
      y = targetRect.bottom + GAP;
      break;
    case 'top':
      x = targetRect.left + targetRect.width / 2 - TOOLTIP_W / 2;
      y = targetRect.top - GAP - tooltipH;
      break;
    case 'left':
      x = targetRect.left - GAP - TOOLTIP_W;
      y = targetRect.top + targetRect.height / 2 - tooltipH / 2;
      break;
    case 'right':
      x = targetRect.right + GAP;
      y = targetRect.top + targetRect.height / 2 - tooltipH / 2;
      break;
  }

  // Clamp within viewport
  x = Math.max(12, Math.min(x, vw - TOOLTIP_W - 12));
  y = Math.max(12, Math.min(y, vh - tooltipH - 12));

  return { x, y, actualPlacement: p };
}

/** Arrow position relative to tooltip card */
function arrowStyle(
  placement: string,
  targetRect: DOMRect,
  tooltipX: number,
  tooltipY: number,
): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    width: 12,
    height: 12,
    background: 'white',
    transform: 'rotate(45deg)',
    zIndex: 0,
  };

  // Point the arrow toward the target center
  const tcx = targetRect.left + targetRect.width / 2;
  const tcy = targetRect.top + targetRect.height / 2;

  switch (placement) {
    case 'bottom': {
      const arrowX = Math.max(20, Math.min(tcx - tooltipX, TOOLTIP_W - 20));
      return { ...base, top: -6, left: arrowX, boxShadow: '-1px -1px 2px rgba(0,0,0,0.06)' };
    }
    case 'top': {
      const arrowX = Math.max(20, Math.min(tcx - tooltipX, TOOLTIP_W - 20));
      return { ...base, bottom: -6, left: arrowX, boxShadow: '1px 1px 2px rgba(0,0,0,0.06)' };
    }
    case 'left':
      return { ...base, right: -6, top: Math.max(20, Math.min(tcy - tooltipY, 60)), boxShadow: '1px -1px 2px rgba(0,0,0,0.06)' };
    case 'right':
      return { ...base, left: -6, top: Math.max(20, Math.min(tcy - tooltipY, 60)), boxShadow: '-1px 1px 2px rgba(0,0,0,0.06)' };
    default:
      return base;
  }
}

/* ── components ────────────────────────────────────── */

function Overlay({ targetRect }: { targetRect: DOMRect }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9990 }}>
      <svg width="100%" height="100%" style={{ display: 'block' }}>
        <defs>
          <mask id="tour-spotlight">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={targetRect.left - PAD}
              y={targetRect.top - PAD}
              width={targetRect.width + PAD * 2}
              height={targetRect.height + PAD * 2}
              rx={RADIUS}
              ry={RADIUS}
              fill="black"
            />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.5)" mask="url(#tour-spotlight)" />
      </svg>
      {/* highlight ring */}
      <div
        style={{
          position: 'fixed',
          left: targetRect.left - PAD,
          top: targetRect.top - PAD,
          width: targetRect.width + PAD * 2,
          height: targetRect.height + PAD * 2,
          borderRadius: RADIUS,
          border: '2px solid rgba(229,62,62,0.4)',
          boxShadow: '0 0 0 4000px transparent',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function TooltipCard({
  step,
  index,
  total,
  targetRect,
  onNext,
  onPrev,
  onClose,
}: {
  step: Step;
  index: number;
  total: number;
  targetRect: DOMRect;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, placement: 'bottom' });

  // Recompute on mount, scroll, resize
  const recompute = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const h = el.offsetHeight || 180;
    const newTarget = document.querySelector<HTMLElement>(step.target);
    const rect = newTarget ? newTarget.getBoundingClientRect() : targetRect;
    const p = calcPosition(rect, step.placement || 'bottom', h);
    setPos({ x: p.x, y: p.y, placement: p.actualPlacement });
  }, [step.target, step.placement, targetRect]);

  useLayoutEffect(() => {
    recompute();
  }, [recompute]);

  useEffect(() => {
    window.addEventListener('scroll', recompute, true);
    window.addEventListener('resize', recompute);
    return () => {
      window.removeEventListener('scroll', recompute, true);
      window.removeEventListener('resize', recompute);
    };
  }, [recompute]);

  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: TOOLTIP_W,
        maxWidth: 'calc(100vw - 24px)',
        zIndex: 9995,
        animation: 'tour-fade-in .2s ease-out',
      }}
    >
      <div
        style={{
          position: 'relative',
          background: 'white',
          borderRadius: 16,
          padding: '20px 24px 16px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        {/* arrow */}
        <div style={arrowStyle(pos.placement, targetRect, pos.x, pos.y)} />

        {/* close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: '#f1f5f9', border: 'none', cursor: 'pointer',
            color: '#94a3b8', fontSize: 12, padding: '4px 6px',
            borderRadius: 6, lineHeight: 1,
          }}
        >
          <CloseOutlined />
        </button>

        {/* step badge */}
        <span
          style={{
            display: 'inline-block',
            fontSize: 11, fontWeight: 700, color: '#E53E3E',
            background: '#fef2f2', borderRadius: 6,
            padding: '2px 8px', marginBottom: 8,
          }}
        >
          {index + 1} / {total}
        </span>

        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', margin: '0 0 6px', lineHeight: 1.3 }}>
          {step.title}
        </h3>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: '#64748b', margin: '0 0 16px' }}>
          {step.content}
        </p>

        {/* footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* dots */}
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === index ? 18 : 7,
                  height: 7,
                  borderRadius: 4,
                  background: i === index ? '#E53E3E' : i < index ? '#fca5a5' : '#e2e8f0',
                  transition: 'all .25s ease',
                }}
              />
            ))}
          </div>

          {/* buttons */}
          <div style={{ display: 'flex', gap: 6 }}>
            {isFirst ? (
              <button
                onClick={onClose}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 500, color: '#94a3b8', padding: '6px 10px',
                }}
              >
                Bỏ qua
              </button>
            ) : (
              <button
                onClick={onPrev}
                style={{
                  background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10,
                  padding: '6px 12px', fontSize: 13, fontWeight: 600, color: '#64748b',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3,
                }}
              >
                <LeftOutlined style={{ fontSize: 9 }} /> Quay lại
              </button>
            )}
            <button
              onClick={isLast ? onClose : onNext}
              style={{
                background: '#E53E3E', border: 'none', borderRadius: 10,
                padding: '6px 16px', fontSize: 13, fontWeight: 700, color: 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3,
                boxShadow: '0 2px 8px rgba(229,62,62,0.3)',
              }}
            >
              {isLast ? 'Hoàn thành' : 'Tiếp'} {!isLast && <RightOutlined style={{ fontSize: 9 }} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── main ──────────────────────────────────────────── */

export default function TourGuide({ page }: Props) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const key = `${TOUR_KEY}_${page}`;
  const steps = STEPS[page] || [];

  // Mount + auto-start
  useEffect(() => {
    setReady(true);
    if (!localStorage.getItem(key) && steps.length > 0) {
      const t = setTimeout(() => { setStep(0); setActive(true); }, 1500);
      return () => clearTimeout(t);
    }
  }, [key, steps.length]);

  // Resolve target element whenever step changes
  useEffect(() => {
    if (!active) { setTargetRect(null); return; }
    if (step >= steps.length) { close(); return; }

    let cancelled = false;
    const resolve = () => {
      const el = document.querySelector<HTMLElement>(steps[step].target);
      if (!el) {
        // target not in DOM → skip
        if (step < steps.length - 1) setStep(step + 1);
        else close();
        return;
      }
      // scroll into view, then grab rect after scroll settles
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => {
        if (cancelled) return;
        setTargetRect(el.getBoundingClientRect());
      }, 350);
    };
    // small delay for DOM readiness
    const t = setTimeout(resolve, 100);
    return () => { cancelled = true; clearTimeout(t); };
  }, [active, step, steps]);

  // Keep targetRect fresh on scroll / resize
  useEffect(() => {
    if (!active || step >= steps.length) return;
    const update = () => {
      const el = document.querySelector<HTMLElement>(steps[step].target);
      if (el) setTargetRect(el.getBoundingClientRect());
    };
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [active, step, steps]);

  // Keyboard
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const close = useCallback(() => {
    setActive(false);
    setTargetRect(null);
    localStorage.setItem(key, '1');
  }, [key]);

  const next = useCallback(() => {
    if (step < steps.length - 1) setStep((s) => s + 1);
    else close();
  }, [step, steps.length, close]);

  const prev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  const start = useCallback(() => {
    setStep(0);
    setActive(true);
  }, []);

  if (!ready || steps.length === 0) return null;

  return (
    <>
      {/* inline keyframe – avoids globals.css dependency */}
      <style>{`@keyframes tour-fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {active && targetRect && createPortal(
        <>
          {/* dark overlay with spotlight hole */}
          <Overlay targetRect={targetRect} />

          {/* tooltip */}
          <TooltipCard
            step={steps[step]}
            index={step}
            total={steps.length}
            targetRect={targetRect}
            onNext={next}
            onPrev={prev}
            onClose={close}
          />
        </>,
        document.body,
      )}

      {/* floating help button */}
      <button
        onClick={start}
        className="fixed bottom-6 right-6 z-[9999] w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-300/60 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer border-0 group"
        title="Hướng dẫn sử dụng"
      >
        <QuestionCircleOutlined className="text-xl group-hover:rotate-12 transition-transform" />
      </button>
    </>
  );
}
