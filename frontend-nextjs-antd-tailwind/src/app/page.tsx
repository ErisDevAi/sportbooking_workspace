'use client';

import {
  Form,
  Input,
  Button,
  Card,
  message,
} from'antd'; 

import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
} from '@ant-design/icons';

import{useRouter} from 'next/navigation';
import{useState} from 'react';

interface LoginForm{
  useName: string;
  password:string;
  email:string;
}

interface RegisterForm{
  fullName: string;
  email:string;
  password:string;
}

export default function HomePage() {
  const router = useRouter();
}

//SWITCH LOGIN / REGISTER
const [isLogin, setIsLogin] = useState(true); 

//LOGIN
const onLogin = async (values: LoginForm) =>{
  try{
    console.log('Login:',values);
    message.success('Đăng nhập thành công');
    router.push('/dashboard');
  }
  catch{
    message.error('Sai tài khoản hoặc mật khẩu');
  }
};

//REGISTER
const onRegister = async(values: RegisterForm)=>{
  try{
    console.log()
  }
}



import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function Home() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [token, router]);

  return null;
}

