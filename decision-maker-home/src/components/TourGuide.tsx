'use client';

import { useState, useEffect, useCallback, useLayoutEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { LeftOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import { createPortal } from 'react-dom';

const TOOLTIP_W = 340;
const GAP = 14;
const PAD = 8;
const RADIUS = 14;

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export interface TourGuideHandle {
  start: () => void;
}

interface Props {
  page: 'wheels' | 'home' | 'categories' | 'stats';
}

/* ── step definitions ─────────────────────────────── */

const STEPS: Record<string, TourStep[]> = {
  wheels: [
    { target: '[data-tour="category-select"]', title: 'Bước 1: Chọn danh mục', content: 'Chọn một chủ đề quyết định: Ăn gì, Làm gì, Đi đâu... hoặc tạo danh mục riêng.', placement: 'bottom' },
    { target: '[data-tour="create-category"]', title: 'Tạo danh mục mới', content: 'Nhấn nút này để tạo danh mục tùy chỉnh với tên, màu sắc và mô tả riêng.', placement: 'bottom' },
    { target: '[data-tour="item-list"]', title: 'Danh sách lựa chọn', content: 'Đây là các lựa chọn trong danh mục. Thêm, sửa, xóa và điều chỉnh trọng số cho mỗi mục.', placement: 'bottom' },
    { target: '[data-tour="wheel"]', title: 'Bước 2: Vòng quay', content: 'Vòng quay hiển thị tất cả lựa chọn. Kích thước phần tương ứng với trọng số.', placement: 'bottom' },
    { target: '[data-tour="spin-button"]', title: 'Nhấn QUAY NGAY!', content: 'Nhấn nút này để quay. Hệ thống chọn kết quả ngẫu nhiên dựa trên trọng số.', placement: 'top' },
  ],
  home: [
    { target: '[data-tour="demo-wheel"]', title: 'Thử quay vòng quay', content: 'Đây là vòng quay demo. Chọn danh mục và nhấn QUAY để thử ngay!', placement: 'bottom' },
    { target: '[data-tour="quick-cards"]', title: 'Bắt đầu nhanh', content: 'Nhấn vào bất kỳ thẻ nào để bắt đầu ngay với chủ đề bạn quan tâm.', placement: 'top' },
  ],
  categories: [
    { target: '[data-tour="create-cat-btn"]', title: 'Tạo danh mục mới', content: 'Nhấn nút này để tạo danh mục riêng: Ăn gì, Đi đâu, Học gì...', placement: 'bottom' },
  ],
  stats: [
    { target: '[data-tour="stats-cards"]', title: 'Tổng quan nhanh', content: 'Xem nhanh streak hiện tại, kỷ lục, tổng lượt quay và ngày hoạt động.', placement: 'bottom' },
    { target: '[data-tour="calendar"]', title: 'Lịch hoạt động', content: 'Nhấn vào mỗi ngày để xem chi tiết hoạt động.', placement: 'top' },
  ],
};

/* ── positioning helpers ──────────────────────────── */

function calcPosition(targetRect: DOMRect, placement: string, tooltipH: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let p = placement;
  const fits: Record<string, boolean> = {
    bottom: targetRect.bottom + GAP + tooltipH < vh,
    top: targetRect.top - GAP - tooltipH > 0,
    left: targetRect.left - GAP - TOOLTIP_W > 0,
    right: targetRect.right + GAP + TOOLTIP_W < vw,
  };
  if (!fits[p]) {
    p = ['bottom', 'top', 'right', 'left'].find((d) => fits[d]) || 'bottom';
  }

  let x = 0, y = 0;
  switch (p) {
    case 'bottom': x = targetRect.left + targetRect.width / 2 - TOOLTIP_W / 2; y = targetRect.bottom + GAP; break;
    case 'top': x = targetRect.left + targetRect.width / 2 - TOOLTIP_W / 2; y = targetRect.top - GAP - tooltipH; break;
    case 'left': x = targetRect.left - GAP - TOOLTIP_W; y = targetRect.top + targetRect.height / 2 - tooltipH / 2; break;
    case 'right': x = targetRect.right + GAP; y = targetRect.top + targetRect.height / 2 - tooltipH / 2; break;
  }
  x = Math.max(12, Math.min(x, vw - TOOLTIP_W - 12));
  y = Math.max(12, Math.min(y, vh - tooltipH - 12));
  return { x, y, actualPlacement: p };
}

function getArrowStyle(placement: string, targetRect: DOMRect, tx: number, ty: number): React.CSSProperties {
  const base: React.CSSProperties = { position: 'absolute', width: 12, height: 12, background: 'white', transform: 'rotate(45deg)', zIndex: 0 };
  const cx = targetRect.left + targetRect.width / 2;
  const cy = targetRect.top + targetRect.height / 2;
  switch (placement) {
    case 'bottom': return { ...base, top: -6, left: Math.max(20, Math.min(cx - tx, TOOLTIP_W - 20)), boxShadow: '-1px -1px 2px rgba(0,0,0,0.06)' };
    case 'top': return { ...base, bottom: -6, left: Math.max(20, Math.min(cx - tx, TOOLTIP_W - 20)), boxShadow: '1px 1px 2px rgba(0,0,0,0.06)' };
    case 'left': return { ...base, right: -6, top: Math.max(20, Math.min(cy - ty, 60)), boxShadow: '1px -1px 2px rgba(0,0,0,0.06)' };
    case 'right': return { ...base, left: -6, top: Math.max(20, Math.min(cy - ty, 60)), boxShadow: '-1px 1px 2px rgba(0,0,0,0.06)' };
    default: return base;
  }
}

/* ── sub-components ───────────────────────────────── */

function Overlay({ rect, onClickOverlay }: { rect: DOMRect; onClickOverlay: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9990, cursor: 'pointer' }} onClick={onClickOverlay}>
      <svg width="100%" height="100%" style={{ display: 'block' }}>
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect x={rect.left - PAD} y={rect.top - PAD} width={rect.width + PAD * 2} height={rect.height + PAD * 2} rx={RADIUS} ry={RADIUS} fill="black" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.5)" mask="url(#tour-mask)" />
      </svg>
      <div style={{ position: 'fixed', left: rect.left - PAD, top: rect.top - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2, borderRadius: RADIUS, border: '2px solid rgba(229,62,62,0.4)', pointerEvents: 'none' }} />
    </div>
  );
}

function Tooltip({ step, index, total, targetRect, onNext, onPrev, onClose }: {
  step: TourStep; index: number; total: number; targetRect: DOMRect;
  onNext: () => void; onPrev: () => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, placement: 'bottom' });

  const recompute = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const h = el.offsetHeight || 180;
    const target = document.querySelector<HTMLElement>(step.target);
    const rect = target ? target.getBoundingClientRect() : targetRect;
    const p = calcPosition(rect, step.placement || 'bottom', h);
    setPos({ x: p.x, y: p.y, placement: p.actualPlacement });
  }, [step.target, step.placement, targetRect]);

  useLayoutEffect(recompute, [recompute]);

  useEffect(() => {
    window.addEventListener('scroll', recompute, true);
    window.addEventListener('resize', recompute);
    return () => { window.removeEventListener('scroll', recompute, true); window.removeEventListener('resize', recompute); };
  }, [recompute]);

  return (
    <div ref={ref} style={{ position: 'fixed', left: pos.x, top: pos.y, width: TOOLTIP_W, maxWidth: 'calc(100vw - 24px)', zIndex: 9995 }}>
      <div style={{ position: 'relative', background: 'white', borderRadius: 16, padding: '20px 24px 16px', boxShadow: '0 16px 48px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08)' }}>
        <div style={getArrowStyle(pos.placement, targetRect, pos.x, pos.y)} />

        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 12, padding: '4px 6px', borderRadius: 6, lineHeight: 1 }}>
          <CloseOutlined />
        </button>

        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#E53E3E', background: '#fef2f2', borderRadius: 6, padding: '2px 8px', marginBottom: 8 }}>
          {index + 1} / {total}
        </span>

        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', margin: '0 0 6px', lineHeight: 1.3 }}>{step.title}</h3>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: '#64748b', margin: '0 0 16px' }}>{step.content}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ width: i === index ? 18 : 7, height: 7, borderRadius: 4, background: i === index ? '#E53E3E' : i < index ? '#fca5a5' : '#e2e8f0', transition: 'all .25s ease' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {index === 0 ? (
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#94a3b8', padding: '6px 10px' }}>Bỏ qua</button>
            ) : (
              <button onClick={onPrev} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '6px 12px', fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                <LeftOutlined style={{ fontSize: 9 }} /> Quay lại
              </button>
            )}
            <button onClick={index === total - 1 ? onClose : onNext} style={{ background: '#E53E3E', border: 'none', borderRadius: 10, padding: '6px 16px', fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, boxShadow: '0 2px 8px rgba(229,62,62,0.3)' }}>
              {index === total - 1 ? 'Hoàn thành' : 'Tiếp'} {index < total - 1 && <RightOutlined style={{ fontSize: 9 }} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── main component (controlled via ref) ─────────── */

const TourGuide = forwardRef<TourGuideHandle, Props>(function TourGuide({ page }, outerRef) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const steps = STEPS[page] || [];

  useEffect(() => { setMounted(true); }, []);

  // Expose start() to parent via ref
  useImperativeHandle(outerRef, () => ({
    start() { setStep(0); setActive(true); },
  }), []);

  // Resolve target when step changes
  useEffect(() => {
    if (!active) { setTargetRect(null); return; }
    if (step >= steps.length) { close(); return; }

    let cancelled = false;
    const t = setTimeout(() => {
      const el = document.querySelector<HTMLElement>(steps[step].target);
      if (!el) { step < steps.length - 1 ? setStep(step + 1) : close(); return; }
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => { if (!cancelled) setTargetRect(el.getBoundingClientRect()); }, 350);
    }, 100);
    return () => { cancelled = true; clearTimeout(t); };
  }, [active, step, steps]);

  // Keep rect fresh
  useEffect(() => {
    if (!active || step >= steps.length) return;
    const update = () => {
      const el = document.querySelector<HTMLElement>(steps[step].target);
      if (el) setTargetRect(el.getBoundingClientRect());
    };
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update); };
  }, [active, step, steps]);

  // Keyboard
  useEffect(() => {
    if (!active) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  // Disable body scroll when active
  useEffect(() => {
    if (active) { document.body.style.overflow = 'hidden'; }
    return () => { document.body.style.overflow = ''; };
  }, [active]);

  const close = useCallback(() => { setActive(false); setTargetRect(null); }, []);
  const next = useCallback(() => { step < steps.length - 1 ? setStep(s => s + 1) : close(); }, [step, steps.length, close]);
  const prev = useCallback(() => { if (step > 0) setStep(s => s - 1); }, [step]);

  if (!mounted || steps.length === 0) return null;
  if (!active || !targetRect) return null;

  return createPortal(
    <>
      <Overlay rect={targetRect} onClickOverlay={close} />
      <Tooltip step={steps[step]} index={step} total={steps.length} targetRect={targetRect} onNext={next} onPrev={prev} onClose={close} />
    </>,
    document.body,
  );
});

export default TourGuide;
