'use client';

import { useEffect } from 'react';
import { Form, Input, Button, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const login = useAuthStore((s) => s.login);
  const token = useAuthStore((s) => s.token);
  const [form] = Form.useForm();

  useEffect(() => {
    if (token) {
      router.replace('/wheels');
    }
  }, [token, router]);

  const onFinish = async (values: LoginForm) => {
    try {
      await login(values.email, values.password);
      message.success('Đăng nhập thành công');
      router.push('/wheels');
    } catch {
      message.error('Sai email hoặc mật khẩu');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v10" />
                <path d="M18 12h-6" />
                <path d="M12 22v-10" />
                <path d="M6 12h6" />
              </svg>
            </div>
            <span className="text-xl font-black text-slate-800">Decision Maker</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Đăng nhập</h1>
            <p className="text-slate-500 mt-1 text-sm">Chào mừng bạn quay lại!</p>
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
              <Button type="primary" htmlType="submit" block className="!h-12 !rounded-lg !font-bold">
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6 text-sm text-slate-500">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-purple-600 font-semibold hover:text-purple-700">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
