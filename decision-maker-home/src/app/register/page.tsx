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
      useAuthStore.setState({ token, user });
      message.success('Đăng ký thành công!');
      router.push('/wheels');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại';
      message.error(msg);
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
            <h1 className="text-2xl font-bold text-slate-800">Đăng ký tài khoản</h1>
            <p className="text-slate-500 mt-1 text-sm">Tạo tài khoản để bắt đầu sử dụng</p>
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
              <Button type="primary" htmlType="submit" block className="!h-12 !rounded-lg !font-bold">
                Đăng ký
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6 text-sm text-slate-500">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-purple-600 font-semibold hover:text-purple-700">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
