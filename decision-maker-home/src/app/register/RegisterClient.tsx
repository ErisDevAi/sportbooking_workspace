'use client';

import { Form, Input, Button, App } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/auth';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterForm) => {
    try {
      const res = await authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      const { token, user } = res.data.data;
      useAuthStore.setState({
        token,
        user: {
          _id: user._id, name: user.name, email: user.email,
          role: user.role || 'editor', isActive: true, permissions: [],
          createdAt: (user as any).createdAt,
        },
      });
      message.success('Đăng ký thành công!');
      router.replace('/wheels');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại';
      message.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50/30 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-red-100 rounded-full blur-3xl opacity-30 blob-animate-2" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20 blob-animate-1" />

      <div className="w-full max-w-md relative animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-200/50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" fill="white" />
                <line x1="12" y1="3" x2="12" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="17" x2="12" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="12" x2="7" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="17" y1="12" x2="21" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-black text-slate-800">Decision<span className="text-red-500">Maker</span></span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Smart Choices</span>
            </div>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 animate-scale-in delay-200">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Tạo tài khoản mới</h1>
            <p className="text-slate-500 mt-1 text-sm">Miễn phí, không giới hạn lượt quay</p>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off" size="large">
            <Form.Item
              name="name"
              label="Họ tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input prefix={<UserOutlined className="text-slate-300" />} placeholder="Nguyễn Văn A" className="!rounded-lg" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input prefix={<MailOutlined className="text-slate-300" />} placeholder="your@email.com" className="!rounded-lg" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
              ]}
            >
              <Input.Password prefix={<LockOutlined className="text-slate-300" />} placeholder="Tối thiểu 6 ký tự" className="!rounded-lg" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('Mật khẩu không khớp'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined className="text-slate-300" />} placeholder="Nhập lại mật khẩu" className="!rounded-lg" />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button type="primary" htmlType="submit" block className="!h-12 !rounded-lg !font-bold !bg-red-500 !border-red-500 hover:!bg-red-600">
                Đăng ký miễn phí
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6 text-sm text-slate-500">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-red-500 font-semibold hover:text-red-600">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
