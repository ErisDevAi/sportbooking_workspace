'use client';

import { useState } from 'react';
import { Input, Button, Tag, App, Collapse, Tooltip } from 'antd';
import { SendOutlined, CopyOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  label: string;
  auth: boolean;
  body?: string;
}

interface EndpointGroup {
  title: string;
  color: string;
  endpoints: Endpoint[];
}

const API_GROUPS: EndpointGroup[] = [
  {
    title: 'Auth - Xác thực',
    color: '#E53E3E',
    endpoints: [
      { method: 'POST', path: '/auth/register', label: 'Đăng ký tài khoản', auth: false, body: '{\n  "name": "Test User",\n  "email": "test@test.com",\n  "password": "123456"\n}' },
      { method: 'POST', path: '/auth/login', label: 'Đăng nhập', auth: false, body: '{\n  "email": "admin@example.com",\n  "password": "password123"\n}' },
      { method: 'GET', path: '/auth/me', label: 'Thông tin người dùng hiện tại', auth: true },
    ],
  },
  {
    title: 'Users - Người dùng',
    color: '#3b82f6',
    endpoints: [
      { method: 'GET', path: '/users?page=1&limit=10', label: 'Danh sách người dùng', auth: true },
      { method: 'GET', path: '/users/{id}', label: 'Chi tiết người dùng', auth: true },
      { method: 'POST', path: '/users', label: 'Tạo người dùng', auth: true, body: '{\n  "name": "New User",\n  "email": "new@test.com",\n  "password": "123456",\n  "role": "viewer"\n}' },
      { method: 'PUT', path: '/users/{id}', label: 'Cập nhật người dùng', auth: true, body: '{\n  "name": "Updated Name",\n  "role": "editor"\n}' },
      { method: 'DELETE', path: '/users/{id}', label: 'Xóa người dùng', auth: true },
    ],
  },
  {
    title: 'Roles - Vai trò',
    color: '#E53E3E',
    endpoints: [
      { method: 'GET', path: '/roles', label: 'Danh sách vai trò', auth: true },
      { method: 'GET', path: '/roles/{id}', label: 'Chi tiết vai trò', auth: true },
      { method: 'POST', path: '/roles', label: 'Tạo vai trò', auth: true, body: '{\n  "name": "custom_role",\n  "label": "Custom Role",\n  "permissions": ["view_category"]\n}' },
      { method: 'PUT', path: '/roles/{id}', label: 'Cập nhật vai trò', auth: true, body: '{\n  "label": "Updated Role",\n  "permissions": ["view_category", "create_category"]\n}' },
      { method: 'DELETE', path: '/roles/{id}', label: 'Xóa vai trò', auth: true },
    ],
  },
  {
    title: 'Permissions - Quyền hạn',
    color: '#ec4899',
    endpoints: [
      { method: 'GET', path: '/permissions', label: 'Danh sách quyền hạn', auth: true },
      { method: 'POST', path: '/permissions', label: 'Tạo quyền hạn', auth: true, body: '{\n  "slug": "custom_perm",\n  "label": "Custom Permission",\n  "description": "Mô tả quyền",\n  "module": "custom"\n}' },
      { method: 'DELETE', path: '/permissions/{id}', label: 'Xóa quyền hạn', auth: true },
    ],
  },
  {
    title: 'Categories - Danh mục',
    color: '#10b981',
    endpoints: [
      { method: 'GET', path: '/categories', label: 'Danh sách danh mục', auth: true },
      { method: 'GET', path: '/categories/{id}', label: 'Chi tiết danh mục', auth: true },
      { method: 'POST', path: '/categories', label: 'Tạo danh mục', auth: true, body: '{\n  "name": "Test Category",\n  "color": "#E53E3E",\n  "description": "Mô tả",\n  "isPublic": true\n}' },
      { method: 'PUT', path: '/categories/{id}', label: 'Cập nhật danh mục', auth: true, body: '{\n  "name": "Updated Category"\n}' },
      { method: 'DELETE', path: '/categories/{id}', label: 'Xóa danh mục', auth: true },
    ],
  },
  {
    title: 'Wheel Contents - Nội dung vòng quay',
    color: '#f59e0b',
    endpoints: [
      { method: 'GET', path: '/wheel-contents?categoryId={id}', label: 'Danh sách theo danh mục', auth: true },
      { method: 'GET', path: '/wheel-contents/wheel/{categoryId}', label: 'Lấy cho vòng quay (active)', auth: true },
      { method: 'GET', path: '/wheel-contents/{id}', label: 'Chi tiết', auth: true },
      { method: 'DELETE', path: '/wheel-contents/{id}', label: 'Xóa', auth: true },
    ],
  },
  {
    title: 'Spin History - Lịch sử quay',
    color: '#ef4444',
    endpoints: [
      { method: 'POST', path: '/spin-history', label: 'Ghi lượt quay', auth: true, body: '{\n  "categoryId": "{id}",\n  "selectedContentId": "{id}"\n}' },
      { method: 'GET', path: '/spin-history?page=1&limit=10', label: 'Lịch sử quay', auth: true },
      { method: 'GET', path: '/spin-history/streak', label: 'Thông tin streak', auth: true },
      { method: 'GET', path: '/spin-history/stats/{categoryId}', label: 'Thống kê theo danh mục', auth: true },
    ],
  },
  {
    title: 'Dashboard & System',
    color: '#06b6d4',
    endpoints: [
      { method: 'GET', path: '/dashboard/stats', label: 'Thống kê hệ thống', auth: true },
      { method: 'GET', path: '/health', label: 'Health Check', auth: false },
    ],
  },
];

const METHOD_COLORS: Record<string, { bg: string; text: string }> = {
  GET: { bg: '#ecfdf5', text: '#059669' },
  POST: { bg: '#eff6ff', text: '#2563eb' },
  PUT: { bg: '#fffbeb', text: '#d97706' },
  DELETE: { bg: '#fef2f2', text: '#dc2626' },
};

export default function ApiDocsPage() {
  const { message: msg } = App.useApp();
  const token = useAuthStore((s) => s.token);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  const [customToken, setCustomToken] = useState(token || '');
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [pathInput, setPathInput] = useState('');
  const [bodyInput, setBodyInput] = useState('');
  const [response, setResponse] = useState('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const selectEndpoint = (ep: Endpoint) => {
    setSelectedEndpoint(ep);
    setPathInput(ep.path);
    setBodyInput(ep.body || '');
    setResponse('');
    setResponseStatus(null);
  };

  const sendRequest = async () => {
    if (!pathInput) return;
    setLoading(true);
    setResponse('');
    setResponseStatus(null);

    try {
      const url = `${baseUrl}${pathInput}`;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customToken) headers['Authorization'] = `Bearer ${customToken}`;

      const options: RequestInit = { method: selectedEndpoint?.method || 'GET', headers };
      if (['POST', 'PUT'].includes(options.method!) && bodyInput) {
        options.body = bodyInput;
      }

      const res = await fetch(url, options);
      setResponseStatus(res.status);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponseStatus(0);
      setResponse(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      msg.success('Đã copy token hiện tại');
    }
  };

  const statusColor = responseStatus === null
    ? 'default'
    : responseStatus >= 200 && responseStatus < 300
      ? 'green'
      : responseStatus === 0 ? 'default' : 'red';

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">API Documentation</h1>
        <p className="text-sm text-slate-500 mt-1">
          Test API endpoints trực tiếp &middot; Base URL:{' '}
          <code className="bg-red-50 text-red-700 px-2 py-0.5 rounded-md text-xs font-semibold">{baseUrl}</code>
        </p>
      </div>

      {/* Token Section */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-50 to-red-50 border border-red-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <LockOutlined className="text-red-600" />
            <span className="text-sm font-bold text-red-800">Bearer Token</span>
          </div>
          {token && (
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={copyToken}
              className="!text-xs !rounded-lg !border-red-200 !text-red-600"
            >
              Copy từ phiên đăng nhập
            </Button>
          )}
        </div>
        <Input.TextArea
          value={customToken}
          onChange={(e) => setCustomToken(e.target.value)}
          placeholder="Paste JWT token vào đây để xác thực API..."
          rows={2}
          className="!font-mono !text-xs !rounded-xl !border-red-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* Left - Endpoints */}
        <div className="rounded-2xl border border-slate-100 overflow-hidden bg-white">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-700 text-sm">
              Tất cả Endpoints
              <span className="ml-2 text-xs font-normal text-slate-400">
                ({API_GROUPS.reduce((sum, g) => sum + g.endpoints.length, 0)} API)
              </span>
            </h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            <Collapse
              ghost
              defaultActiveKey={API_GROUPS.map((g) => g.title)}
              items={API_GROUPS.map((group) => ({
                key: group.title,
                label: (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                    <span className="font-semibold text-sm text-slate-700">{group.title}</span>
                    <span className="text-[10px] text-slate-400 ml-auto">{group.endpoints.length}</span>
                  </div>
                ),
                children: (
                  <div className="space-y-1 -mt-1">
                    {group.endpoints.map((ep, i) => {
                      const mc = METHOD_COLORS[ep.method];
                      const isSelected = selectedEndpoint === ep;
                      return (
                        <button
                          key={i}
                          onClick={() => selectEndpoint(ep)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-2.5 transition-all ${
                            isSelected
                              ? 'bg-red-50 border border-red-200 shadow-sm'
                              : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <span
                            className="text-[10px] font-black w-12 text-center rounded-md px-1 py-0.5 shrink-0"
                            style={{ color: mc.text, backgroundColor: mc.bg }}
                          >
                            {ep.method}
                          </span>
                          <span className="text-slate-600 truncate text-xs">{ep.label}</span>
                          {ep.auth && (
                            <Tooltip title="Cần xác thực">
                              <LockOutlined className="ml-auto text-[10px] text-orange-400" />
                            </Tooltip>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ),
              }))}
            />
          </div>
        </div>

        {/* Right - Request & Response */}
        <div className="space-y-5">
          {/* Request */}
          <div className="rounded-2xl border border-slate-100 p-5 bg-white">
            <div className="flex gap-2 items-center">
              <h3 className="font-bold text-slate-700 text-sm mb-4">Request</h3>
            {selectedEndpoint && (
                <Tag
                  className="!font-black !text-xs !px-3 !py-1 !rounded-lg !border-0 justify-center items-center"
                  style={{
                    color: METHOD_COLORS[selectedEndpoint.method].text,
                    backgroundColor: METHOD_COLORS[selectedEndpoint.method].bg,
                  }}
                >
                  {selectedEndpoint.method}
                </Tag>
              )}
            </div>
            <div className="flex gap-2 mb-4 items-center">
              <Input
                value={pathInput}
                onChange={(e) => setPathInput(e.target.value)}
                placeholder="/endpoint"
                className="!font-mono !text-sm flex-1 !rounded-xl"
                addonBefore={<span className="text-xs text-slate-400">{baseUrl}</span>}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendRequest}
                loading={loading}
                className="!font-bold !rounded-xl !px-6"
              >
                Gửi
              </Button>
            </div>

            {selectedEndpoint && ['POST', 'PUT'].includes(selectedEndpoint.method) && (
              <div>
                <p className="text-xs text-slate-500 mb-2 font-semibold">Body (JSON)</p>
                <Input.TextArea
                  value={bodyInput}
                  onChange={(e) => setBodyInput(e.target.value)}
                  rows={6}
                  className="!font-mono !text-xs !rounded-xl"
                  placeholder='{"key": "value"}'
                />
              </div>
            )}

            {!selectedEndpoint && (
              <div className="text-center py-8 text-slate-400">
                <p className="text-3xl mb-2">👈</p>
                <p className="text-sm">Chọn endpoint bên trái để bắt đầu test</p>
              </div>
            )}
          </div>

          {/* Response */}
          <div className="rounded-2xl border border-slate-100 p-5 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 text-sm">Response</h3>
              {responseStatus !== null && (
                <Tag
                  color={statusColor}
                  className="!font-bold !rounded-lg"
                >
                  {responseStatus === 0 ? 'Network Error' : `${responseStatus} ${responseStatus >= 200 && responseStatus < 300 ? 'OK' : 'Error'}`}
                </Tag>
              )}
            </div>
            <pre className="bg-slate-900 text-emerald-400 rounded-xl p-5 text-xs font-mono overflow-auto max-h-[420px] min-h-[140px] whitespace-pre-wrap leading-relaxed">
              {response || '// Kết quả sẽ hiển thị ở đây sau khi gửi request...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
