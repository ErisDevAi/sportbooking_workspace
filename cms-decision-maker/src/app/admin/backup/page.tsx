'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  App,
  Tag,
  Input,
  Typography,
  Card,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  CloudUploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  UndoOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { backupApi } from '@/api/backup';
import type { Backup } from '@/types/backup';

const { Title, Text } = Typography;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function BackupPage() {
  const { message, modal } = App.useApp();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchBackups = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await backupApi.list({ page, limit });
      setBackups(res.data.data);
      if (res.data.meta) {
        setPagination({
          current: res.data.meta.page,
          pageSize: res.data.meta.limit,
          total: res.data.meta.total,
        });
      }
    } catch {
      message.error('Không thể tải danh sách sao lưu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreate = async () => {
    try {
      setCreating(true);
      await backupApi.create(note || undefined);
      message.success('Sao lưu thành công!');
      setNote('');
      fetchBackups();
    } catch {
      message.error('Sao lưu thất bại');
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (id: string) => {
    modal.confirm({
      title: 'Xác nhận phục hồi',
      content: (
        <div>
          <p style={{ color: '#ff4d4f', fontWeight: 600 }}>
            Cảnh báo: Thao tác này sẽ ghi đè toàn bộ dữ liệu hiện tại!
          </p>
          <p>Bạn có chắc chắn muốn phục hồi từ bản sao lưu này?</p>
        </div>
      ),
      okText: 'Phục hồi',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setRestoring(id);
          const res = await backupApi.restore(id);
          const count = res.data.data.restoredCollections.length;
          message.success(`Phục hồi thành công ${count} collection!`);
          fetchBackups();
        } catch {
          message.error('Phục hồi thất bại');
        } finally {
          setRestoring(null);
        }
      },
    });
  };

  const handleDownload = async (id: string, filename: string) => {
    try {
      const res = await backupApi.download(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      message.error('Tải xuống thất bại');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await backupApi.delete(id);
      message.success('Đã xóa bản sao lưu');
      fetchBackups();
    } catch {
      message.error('Xóa thất bại');
    }
  };

  const columns = [
    {
      title: 'Tên file',
      dataIndex: 'filename',
      key: 'filename',
      render: (text: string) => (
        <Text code style={{ fontSize: 12 }}>{text}</Text>
      ),
    },
    {
      title: 'Kích thước',
      dataIndex: 'size',
      key: 'size',
      width: 120,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: 'Collections',
      dataIndex: 'collections',
      key: 'collections',
      width: 120,
      render: (cols: string[]) => (
        <Tag color="blue">{cols.length} collections</Tag>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 200,
      render: (text: string) => text || <Text type="secondary">-</Text>,
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 150,
      render: (user: Backup['createdBy']) =>
        typeof user === 'object' ? user.name : user,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_: unknown, record: Backup) => (
        <Space size="small">
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record._id, record.filename)}
          >
            Tải
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<UndoOutlined />}
            loading={restoring === record._id}
            onClick={() => handleRestore(record._id)}
            style={{ background: '#faad14', borderColor: '#faad14' }}
          >
            Phục hồi
          </Button>
          <Popconfirm
            title="Xóa bản sao lưu này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            <DatabaseOutlined className="mr-2" />
            Sao lưu & Phục hồi
          </Title>
          <Text type="secondary">Quản lý sao lưu dữ liệu hệ thống</Text>
        </div>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="Tổng bản sao lưu"
              value={pagination.total}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Ghi chú cho bản sao lưu (tùy chọn)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                loading={creating}
                onClick={handleCreate}
                size="large"
              >
                Tạo sao lưu mới
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={backups}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bản sao lưu`,
          onChange: (page, pageSize) => fetchBackups(page, pageSize),
        }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
}
