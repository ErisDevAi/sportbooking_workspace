'use client';

import Link from 'next/link';
import {
  ThunderboltOutlined,
  TrophyOutlined,
  UserOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  FireOutlined,
  ArrowRightOutlined,
  StarOutlined,
  HeartOutlined,
  TeamOutlined,
  ExperimentOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-5 rounded-full bg-red-50 border border-red-100 px-4 py-2 text-sm font-bold text-red-600">
            <HeartOutlined /> Về Decision Maker
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Giúp bạn ra quyết định{' '}
            <span className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 bg-clip-text text-transparent">
              nhanh hơn, vui hơn
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Decision Maker biến những quyết định nhỏ hàng ngày thành trải nghiệm thú vị.
            Không còn &ldquo;ăn gì hôm nay?&rdquo; — chỉ còn quay và hành động.
          </p>
        </div>
      </section>

      {/* Story section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Câu chuyện</span>
              <h2 className="text-3xl font-black text-slate-800 mb-6">
                Bắt đầu từ một câu hỏi đơn giản
              </h2>
              <div className="space-y-4 text-slate-500 leading-relaxed text-[17px]">
                <p>
                  Mỗi ngày, chúng ta đều phải đối mặt với hàng chục quyết định nhỏ:
                  <strong className="text-slate-700"> &ldquo;Ăn gì?&rdquo;</strong>,
                  <strong className="text-slate-700"> &ldquo;Làm gì?&rdquo;</strong>,
                  <strong className="text-slate-700"> &ldquo;Đi đâu?&rdquo;</strong>
                  Tưởng chừng đơn giản nhưng chúng tiêu tốn năng lượng và thời gian không ít.
                </p>
                <p>
                  Decision Maker ra đời để giải quyết vấn đề đó. Thay vì suy nghĩ, bạn chỉ cần quay vòng quay
                  và để thuật toán Smart Random đưa ra gợi ý thông minh dựa trên lịch sử và sở thích của bạn.
                </p>
                <p>
                  Với hệ thống gamification — streak, check-in, thống kê — việc ra quyết định trở thành
                  một thói quen tích cực mỗi ngày.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { number: '3', label: 'Bước để quyết định', icon: <ThunderboltOutlined />, bg: 'bg-red-50', text: 'text-red-600' },
                { number: '∞', label: 'Lượt quay miễn phí', icon: <StarOutlined />, bg: 'bg-orange-50', text: 'text-orange-600' },
                { number: '24/7', label: 'Luôn sẵn sàng', icon: <RocketOutlined />, bg: 'bg-emerald-50', text: 'text-emerald-600' },
                { number: '100%', label: 'Cá nhân hóa', icon: <UserOutlined />, bg: 'bg-blue-50', text: 'text-blue-600' },
              ].map((item, i) => (
                <div key={i} className={`rounded-2xl ${item.bg} p-6 text-center`}>
                  <div className={`${item.text} text-2xl mb-2`}>{item.icon}</div>
                  <p className="text-3xl font-black text-slate-800 mb-1">{item.number}</p>
                  <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Giá trị cốt lõi</span>
            <h2 className="text-3xl font-black text-slate-800 mb-4">Tại sao Decision Maker khác biệt?</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Không chỉ là vòng quay may mắn, mà là công cụ thay đổi thói quen</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <ThunderboltOutlined />, title: 'Nhanh chóng', desc: 'Ra quyết định trong vài giây thay vì hàng giờ suy nghĩ', color: 'red' },
              { icon: <TrophyOutlined />, title: 'Vui vẻ', desc: 'Gamification biến quyết định thành trò chơi hấp dẫn', color: 'orange' },
              { icon: <ExperimentOutlined />, title: 'Thông minh', desc: 'Thuật toán Smart Random học từ thói quen của bạn', color: 'emerald' },
              { icon: <HeartOutlined />, title: 'Đơn giản', desc: 'Giao diện trực quan, ai cũng dùng được ngay', color: 'blue' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-100 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 flex items-center justify-center mx-auto mb-4 text-${item.color}-500 text-2xl`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-4 relative">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-400 mb-3">Cách hoạt động</span>
            <h2 className="text-3xl font-black mb-3 text-white">Từ câu hỏi đến hành động</h2>
            <p className="text-slate-400 text-lg">Quy trình đơn giản, kết quả tuyệt vời</p>
          </div>

          <div className="space-y-4">
            {[
              { step: '1', title: 'Chọn danh mục', desc: 'Chọn chủ đề quyết định: ăn gì, làm gì, đi đâu, học gì... hoặc tạo danh mục riêng của bạn.', icon: <StarOutlined /> },
              { step: '2', title: 'Quay vòng quay', desc: 'Nhấn QUAY NGAY! Thuật toán Smart Random chọn kết quả dựa trên trọng số, lịch sử và sở thích.', icon: <ThunderboltOutlined /> },
              { step: '3', title: 'Nhận kết quả', desc: 'Xem kết quả. Chấp nhận để tiếp tục hoặc quay lại (tối đa 2 lần re-spin mỗi ngày).', icon: <CheckCircleOutlined /> },
              { step: '4', title: 'Check-in & Streak', desc: 'Thực hiện quyết định, check-in và duy trì chuỗi streak để tạo thói quen tích cực.', icon: <FireOutlined /> },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-5 rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-lg font-black text-white shrink-0 shadow-lg shadow-red-500/20">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-white flex items-center gap-2">
                    <span className="text-red-400">{item.icon}</span> {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Random */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Công nghệ</span>
            <h2 className="text-3xl font-black text-slate-800 mb-4">Thuật toán Smart Random</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Không giống random đơn giản — Smart Random hiểu bạn và đưa ra gợi ý tốt hơn theo thời gian
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-black text-lg">W</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Weight gốc</h3>
              <p className="text-sm text-slate-500">Trọng số 1-10 cho mỗi lựa chọn. Cao hơn = xác suất lớn hơn.</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-b from-orange-50 to-white border border-orange-100 p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 font-black text-lg">-50%</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Cooldown</h3>
              <p className="text-sm text-slate-500">Đã chọn trong 3 ngày gần? Giảm 50% weight để tránh lặp lại.</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-black text-lg">+50%</span>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Boost</h3>
              <p className="text-sm text-slate-500">Chưa bao giờ thử? Tăng 50% weight để khuyến khích khám phá.</p>
            </div>
          </div>

          {/* Example table */}
          <div className="rounded-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-3">
              <p className="text-sm font-bold flex items-center gap-2">
                <ExperimentOutlined /> Ví dụ thực tế
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Lựa chọn</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700">Weight gốc</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700">Modifier</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700">Weight cuối</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700">Xác suất</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Cơm tấm', w: 5, mod: 'Boost +50%', modColor: 'text-emerald-600 bg-emerald-50', final: 8, pct: '42.1%' },
                    { name: 'Phở', w: 5, mod: 'Bình thường', modColor: 'text-slate-500 bg-slate-50', final: 5, pct: '26.3%' },
                    { name: 'Pizza', w: 4, mod: 'Bình thường', modColor: 'text-slate-500 bg-slate-50', final: 4, pct: '21.1%' },
                    { name: 'Bún bò', w: 5, mod: 'Cooldown -50%', modColor: 'text-orange-600 bg-orange-50', final: 2, pct: '10.5%' },
                  ].map((item, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-800">{item.name}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{item.w}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${item.modColor}`}>{item.mod}</span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-red-600">{item.final}</td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800">{item.pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-500 mb-3">An toàn & Tin cậy</span>
            <h2 className="text-3xl font-black text-slate-800 mb-4">Bạn có thể yên tâm sử dụng</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <SafetyCertificateOutlined />, title: 'Bảo mật cao', desc: 'Mã hóa mật khẩu, xác thực JWT, phân quyền 3 cấp' },
              { icon: <ThunderboltOutlined />, title: 'Tốc độ nhanh', desc: 'Phản hồi dưới 2 giây, hiệu ứng quay mượt mà' },
              { icon: <RocketOutlined />, title: 'Đa nền tảng', desc: 'Hoạt động trên mọi trình duyệt, desktop, tablet, mobile' },
              { icon: <FireOutlined />, title: 'Miễn phí hoàn toàn', desc: 'Không giới hạn lượt quay, không có quảng cáo phiền phức' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-2xl bg-white border border-slate-100 p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 text-lg shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-14">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5 text-red-500">
              <TeamOutlined className="text-2xl" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">Đội ngũ phát triển</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Decision Maker là sản phẩm của nhóm sinh viên Khoa Công nghệ Thông tin,
              Trường Đại học Mỏ - Địa chất Hà Nội (HUMG).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            

            {/* Đinh Trọng Phúc */}
            <div className="group rounded-2xl bg-white border border-slate-100 p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all">
              <div className="relative mx-auto mb-5 w-28 h-28">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-200 to-cyan-100 animate-pulse-glow" />
                <svg className="relative w-28 h-28" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="56" fill="#DBEAFE" stroke="#BFDBFE" strokeWidth="2"/>
                  <circle cx="60" cy="48" r="22" fill="#FBBF24"/>
                  <path d="M38 48c0-12.15 9.85-22 22-22s22 9.85 22 22" fill="#92400E" opacity="0.15"/>
                  <rect x="36" y="32" width="48" height="8" rx="4" fill="#1E3A5F"/>
                  <path d="M40 32c3-10 10-16 20-16s17 6 20 16" fill="#1E3A5F"/>
                  <path d="M36 40h10l-2-8" fill="#1E3A5F"/>
                  <path d="M84 40h-10l2-8" fill="#1E3A5F"/>
                  <circle cx="50" cy="50" r="3" fill="#1E293B"/>
                  <circle cx="70" cy="50" r="3" fill="#1E293B"/>
                  <circle cx="51" cy="49" r="1" fill="white"/>
                  <circle cx="71" cy="49" r="1" fill="white"/>
                  <path d="M55 60q5 4 10 0" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <rect x="44" y="52" width="4" height="1.5" rx="0.5" fill="#1E3A5F" transform="rotate(-5 44 52)"/>
                  <rect x="72" y="52" width="4" height="1.5" rx="0.5" fill="#1E3A5F" transform="rotate(5 72 52)"/>
                  <path d="M36 80q24 28 48 0" fill="#3B82F6"/>
                  <path d="M36 80q24 12 48 0" fill="#2563EB"/>
                  <path d="M54 80v18M66 80v18" stroke="white" strokeWidth="1" opacity="0.3"/>
                </svg>
              </div>
              <h3 className="font-black text-lg text-slate-800 mb-1">Đinh Trọng Phúc</h3>
              <span className="inline-block text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 mb-3">
                Developer
              </span>
            </div>

{/* Vũ Ngọc Hải Anh - Leader */}
            <div className="group rounded-2xl bg-white border border-slate-100 p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all">
              <div className="relative mx-auto mb-5 w-28 h-28">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-200 to-orange-100 animate-pulse-glow" />
                <svg className="relative w-28 h-28" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="56" fill="#FEE2E2" stroke="#FECACA" strokeWidth="2"/>
                  <circle cx="60" cy="48" r="22" fill="#FBBF24"/>
                  <path d="M38 48c0-12.15 9.85-22 22-22s22 9.85 22 22" fill="#92400E" opacity="0.15"/>
                  <rect x="34" y="38" width="52" height="6" rx="3" fill="#78350F"/>
                  <path d="M42 38c2-8 8-14 18-14s16 6 18 14" fill="#92400E"/>
                  <circle cx="50" cy="50" r="3" fill="#1E293B"/>
                  <circle cx="70" cy="50" r="3" fill="#1E293B"/>
                  <circle cx="51" cy="49" r="1" fill="white"/>
                  <circle cx="71" cy="49" r="1" fill="white"/>
                  <path d="M54 60q6 5 12 0" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <path d="M36 80q24 28 48 0" fill="#E53E3E"/>
                  <path d="M36 80q24 12 48 0" fill="#DC2626"/>
                  <rect x="52" y="78" width="16" height="20" rx="2" fill="white" opacity="0.3"/>
                </svg>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg border-2 border-white">
                  <StarOutlined className="text-white text-xs" />
                </div>
              </div>
              <h3 className="font-black text-lg text-slate-800 mb-1">Vũ Ngọc Hải Anh</h3>
              <span className="inline-block text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full px-3 py-1 mb-3">
                Leader
              </span>
            </div>
            
            {/* Lê Văn Dũng */}
            <div className="group rounded-2xl bg-white border border-slate-100 p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all">
              <div className="relative mx-auto mb-5 w-28 h-28">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-200 to-teal-100 animate-pulse-glow" />
                <svg className="relative w-28 h-28" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="56" fill="#D1FAE5" stroke="#A7F3D0" strokeWidth="2"/>
                  <circle cx="60" cy="48" r="22" fill="#FBBF24"/>
                  <path d="M38 48c0-12.15 9.85-22 22-22s22 9.85 22 22" fill="#92400E" opacity="0.15"/>
                  <path d="M38 42c0-14 10-24 22-24s22 10 22 24" fill="#374151"/>
                  <path d="M38 42h44v4c0 2-1 3-3 3H41c-2 0-3-1-3-3v-4z" fill="#374151"/>
                  <circle cx="50" cy="50" r="3" fill="#1E293B"/>
                  <circle cx="70" cy="50" r="3" fill="#1E293B"/>
                  <circle cx="51" cy="49" r="1" fill="white"/>
                  <circle cx="71" cy="49" r="1" fill="white"/>
                  <path d="M53 59q7 6 14 0" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <path d="M36 80q24 28 48 0" fill="#10B981"/>
                  <path d="M36 80q24 12 48 0" fill="#059669"/>
                  <circle cx="60" cy="86" r="4" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1"/>
                  <path d="M58 86h4M60 84v4" stroke="#F59E0B" strokeWidth="0.8"/>
                </svg>
              </div>
              <h3 className="font-black text-lg text-slate-800 mb-1">Lê Văn Dũng</h3>
              <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 mb-3">
                Developer
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-slate-400 text-sm mb-8">
              Sinh viên Khoa Công nghệ Thông tin — Trường Đại học Mỏ - Địa chất Hà Nội
            </p>
            <Link
              href="/wheels"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-10 py-4 text-white font-bold text-lg shadow-xl shadow-red-200/50 hover:shadow-2xl hover:scale-105 transition-all"
            >
              <ThunderboltOutlined /> Trải nghiệm ngay <ArrowRightOutlined />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
