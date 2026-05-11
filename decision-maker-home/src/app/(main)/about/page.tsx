import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Giới thiệu{' '}
          <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Decision Maker
          </span>
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
          Ứng dụng hỗ trợ đưa ra quyết định hàng ngày - giảm suy nghĩ, tăng hành động
        </p>
      </div>

      {/* Card 1: Câu chuyện */}
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="text-purple-600">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              <path d="M5 3v4M3 5h4M21 17v4M19 19h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Câu chuyện của chúng tôi
          </h2>
        </div>

        <div className="space-y-6 text-slate-500 leading-relaxed text-[17px]">
          <p>
            Decision Maker là dự án được phát triển bởi sinh viên Trường Đại học Mỏ - Địa chất Hà Nội (HUMG).
            Xuất phát từ một vấn đề đơn giản mà ai cũng gặp phải hàng ngày: <strong className="text-slate-700">&ldquo;Hôm nay ăn gì?&rdquo;</strong>,{' '}
            <strong className="text-slate-700">&ldquo;Làm gì bây giờ?&rdquo;</strong>, hay{' '}
            <strong className="text-slate-700">&ldquo;Đi đâu chơi?&rdquo;</strong>
          </p>

          <p>
            Chúng tôi nhận ra rằng việc suy nghĩ quá nhiều về những quyết định nhỏ hàng ngày
            không chỉ tốn thời gian mà còn gây ra stress không cần thiết. Decision Maker ra đời
            để giải quyết vấn đề đó - biến việc đưa ra quyết định thành một trải nghiệm
            thú vị và nhanh chóng thông qua vòng quay ngẫu nhiên.
          </p>

          <p>
            Ứng dụng không chỉ đơn thuần là một vòng quay may mắn. Chúng tôi tích hợp
            hệ thống <strong className="text-slate-700">gamification</strong> với streak, thống kê,
            và lịch sử quay để tạo động lực cho người dùng hành động ngay sau khi nhận kết quả,
            thay vì tiếp tục do dự.
          </p>
        </div>
      </div>

      {/* Card 2: Tính năng nổi bật */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-purple-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Tính năng nổi bật
          </h2>
        </div>

        <div className="text-slate-500 leading-relaxed text-[17px]">
          <ul className="space-y-4 mb-8">
            {[
              {
                title: 'Vòng quay quyết định',
                desc: 'Quay ngẫu nhiên với trọng số tùy chỉnh - xác suất được chọn dựa trên mức độ ưu tiên bạn đặt.',
              },
              {
                title: 'Quản lý danh mục linh hoạt',
                desc: 'Tạo và tùy chỉnh danh mục riêng theo nhu cầu: ăn gì, làm gì, đi đâu, học gì...',
              },
              {
                title: 'Theo dõi streak & thống kê',
                desc: 'Hệ thống streak khuyến khích bạn duy trì thói quen hành động. Xem lịch sử quay và thống kê chi tiết.',
              },
              {
                title: 'Check-in & đánh giá',
                desc: 'Xác nhận hoàn thành quyết định, đánh giá trải nghiệm để cải thiện lựa chọn theo thời gian.',
              },
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex gap-1 mt-1.5 flex-shrink-0 text-purple-600">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m9 6 6 6-6 6Z" />
                  </svg>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m9 6 6 6-6 6Z" />
                  </svg>
                </div>
                <p>
                  <span className="font-bold text-slate-700">{item.title}:</span>{' '}
                  {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card 3: Công nghệ */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-green-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Công nghệ sử dụng
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Frontend', value: 'Next.js, React, Ant Design, TailwindCSS' },
            { label: 'Backend', value: 'Node.js, Express.js' },
            { label: 'Database', value: 'MongoDB' },
            { label: 'State Management', value: 'Zustand' },
          ].map((item, index) => (
            <div key={index} className="rounded-xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-sm font-semibold text-slate-700">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Card 4: Đội ngũ */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-red-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Đội ngũ phát triển
          </h2>
        </div>

        <div className="text-slate-500 leading-relaxed text-[17px]">
          <p>
            Decision Maker được phát triển bởi nhóm sinh viên Khoa Công nghệ Thông tin,
            Trường Đại học Mỏ - Địa chất Hà Nội (HUMG) trong khuôn khổ đồ án môn học.
            Dự án hướng đến mục tiêu xây dựng một ứng dụng web thực tế, giải quyết vấn đề
            đời sống hàng ngày bằng công nghệ hiện đại.
          </p>
        </div>
      </div>
    </div>
  );
}
