'use client';

import { useEffect, Suspense } from 'react';
import { Form, Input, Button, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import SplashScreen from '@/components/SplashScreen';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <LoginPage />
    </Suspense>
  );
}

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/wheels';
  const { message } = App.useApp();
  const login = useAuthStore((s) => s.login);
  const token = useAuthStore((s) => s.token);
  const [form] = Form.useForm();

  useEffect(() => {
    if (token) {
      router.replace(redirectTo);
    }
  }, [token, router, redirectTo]);

  const onFinish = async (values: LoginForm) => {
    try {
      await login(values.email, values.password);
      message.success('Đăng nhập thành công');
      router.replace(redirectTo);
    } catch {
      message.error('Sai email hoặc mật khẩu');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50/30 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-red-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
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
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Chào mừng trở lại!</h1>
            <p className="text-slate-500 mt-1 text-sm">Đăng nhập để tiếp tục sử dụng</p>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off" size="large">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input prefix={<UserOutlined className="text-slate-300" />} placeholder="your@email.com" className="!rounded-lg" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password prefix={<LockOutlined className="text-slate-300" />} placeholder="Nhập mật khẩu" className="!rounded-lg" />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button type="primary" htmlType="submit" block className="!h-12 !rounded-lg !font-bold !bg-red-500 !border-red-500 hover:!bg-red-600">
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6 text-sm text-slate-500">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-red-500 font-semibold hover:text-red-600">
              Đăng ký miễn phí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
