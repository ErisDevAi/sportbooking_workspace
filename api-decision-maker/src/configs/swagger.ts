import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Decision Maker API',
      version: '1.0.0',
      description: 'API documentation cho hệ thống Decision Maker - Hỗ trợ đưa ra quyết định thông minh',
      contact: {
        name: 'Decision Maker Team',
        email: 'support@decisionmaker.io',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập JWT token nhận được từ /auth/login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Admin User' },
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            role: { type: 'string', enum: ['admin', 'editor', 'viewer'], example: 'admin' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Ăn gì hôm nay' },
            slug: { type: 'string', example: 'an-gi-hom-nay' },
            icon: { type: 'string', example: '🍔' },
            color: { type: 'string', example: '#E74C3C' },
            description: { type: 'string', example: 'Quyết định ăn gì' },
            isDefault: { type: 'boolean', example: false },
            isPublic: { type: 'boolean', example: true },
            createdBy: { type: 'string' },
            choiceCount: { type: 'number', example: 5 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        WheelContent: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            label: { type: 'string', example: 'Ăn phở' },
            description: { type: 'string', example: 'Phở bò tái chín' },
            image: { type: 'string', nullable: true },
            color: { type: 'string', example: '#E74C3C' },
            weight: { type: 'number', example: 2, minimum: 1, maximum: 10 },
            categoryId: { type: 'string' },
            isActive: { type: 'boolean', example: true },
            createdBy: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        SpinHistory: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            categoryId: { type: 'string' },
            selectedContentId: { type: 'string' },
            selectedLabel: { type: 'string', example: 'Ăn phở' },
            currentStreak: { type: 'number', example: 3 },
            maxStreak: { type: 'number', example: 7 },
            lastSpinAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Streak: {
          type: 'object',
          properties: {
            categoryId: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                icon: { type: 'string' },
              },
            },
            currentStreak: { type: 'number', example: 3 },
            maxStreak: { type: 'number', example: 7 },
            totalSpins: { type: 'number', example: 25 },
            lastSpinDate: { type: 'string', format: 'date-time' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'array', items: {} },
            meta: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Xác thực: Đăng ký, Đăng nhập, Thông tin user' },
      { name: 'Users', description: 'Quản lý tài khoản người dùng (Admin)' },
      { name: 'Categories', description: 'Quản lý danh mục quyết định' },
      { name: 'Wheel Contents', description: 'Quản lý nội dung vòng quay (lựa chọn)' },
      { name: 'Spin History', description: 'Lịch sử quay và streak' },
      { name: 'Dashboard', description: 'Thống kê tổng quan hệ thống' },
      { name: 'Roles', description: 'Quản lý vai trò' },
      { name: 'Permissions', description: 'Quản lý quyền hạn' },
    ],
    paths: {
      // ── AUTH ──
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Đăng ký tài khoản mới',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'Nguyễn Văn A' },
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    password: { type: 'string', minLength: 6, example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'Đăng ký thành công, trả về token + user' },
            '409': { description: 'Email đã tồn tại' },
            '422': { description: 'Dữ liệu không hợp lệ' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Đăng nhập',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'admin@example.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Đăng nhập thành công',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Login successful' },
                      data: {
                        type: 'object',
                        properties: {
                          token: { type: 'string' },
                          user: { $ref: '#/components/schemas/User' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'Sai email hoặc mật khẩu' },
            '403': { description: 'Tài khoản đã bị khóa' },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Lấy thông tin user hiện tại',
          responses: {
            '200': { description: 'Thông tin user + permissions' },
            '401': { description: 'Chưa đăng nhập' },
          },
        },
      },
      // ── USERS ──
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Danh sách người dùng (phân trang)',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'number', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'number', default: 10 } },
          ],
          responses: {
            '200': { description: 'Danh sách users + meta pagination' },
          },
        },
        post: {
          tags: ['Users'],
          summary: 'Tạo người dùng mới (Admin)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'User Mới' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    role: { type: 'string', enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'Tạo thành công' },
            '409': { description: 'Email đã tồn tại' },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Chi tiết người dùng',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'User detail' }, '404': { description: 'Không tìm thấy' } },
        },
        put: {
          tags: ['Users'],
          summary: 'Cập nhật người dùng',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string' },
                    isActive: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: { '200': { description: 'Cập nhật thành công' } },
        },
        delete: {
          tags: ['Users'],
          summary: 'Xóa người dùng (Admin)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Xóa thành công' } },
        },
      },
      // ── CATEGORIES ──
      '/categories': {
        get: {
          tags: ['Categories'],
          summary: 'Danh sách tất cả danh mục',
          responses: { '200': { description: 'Array of categories' } },
        },
        post: {
          tags: ['Categories'],
          summary: 'Tạo danh mục mới',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'Ăn gì' },
                    icon: { type: 'string', example: '🍔' },
                    color: { type: 'string', example: '#E74C3C' },
                    description: { type: 'string' },
                    isPublic: { type: 'boolean', default: true },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Tạo thành công' } },
        },
      },
      '/categories/{id}': {
        get: {
          tags: ['Categories'],
          summary: 'Chi tiết danh mục',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Category detail' } },
        },
        put: {
          tags: ['Categories'],
          summary: 'Cập nhật danh mục',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    icon: { type: 'string' },
                    color: { type: 'string' },
                    description: { type: 'string' },
                    isPublic: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: { '200': { description: 'Cập nhật thành công' } },
        },
        delete: {
          tags: ['Categories'],
          summary: 'Xóa danh mục',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Xóa thành công' } },
        },
      },
      // ── WHEEL CONTENTS ──
      '/wheel-contents': {
        get: {
          tags: ['Wheel Contents'],
          summary: 'Danh sách lựa chọn theo danh mục (phân trang)',
          parameters: [
            { name: 'categoryId', in: 'query', required: true, schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'number', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'number', default: 10 } },
          ],
          responses: { '200': { description: 'Paginated wheel contents' } },
        },
        post: {
          tags: ['Wheel Contents'],
          summary: 'Tạo lựa chọn mới',
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['label', 'categoryId'],
                  properties: {
                    label: { type: 'string', example: 'Ăn phở' },
                    description: { type: 'string' },
                    color: { type: 'string', example: '#E74C3C' },
                    weight: { type: 'number', minimum: 1, maximum: 10, default: 1 },
                    categoryId: { type: 'string' },
                    image: { type: 'string', format: 'binary' },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Tạo thành công' } },
        },
      },
      '/wheel-contents/wheel/{categoryId}': {
        get: {
          tags: ['Wheel Contents'],
          summary: 'Tất cả lựa chọn active cho vòng quay',
          parameters: [{ name: 'categoryId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'All active wheel contents for spin rendering' } },
        },
      },
      '/wheel-contents/{id}': {
        get: {
          tags: ['Wheel Contents'],
          summary: 'Chi tiết lựa chọn',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Wheel content detail' } },
        },
        put: {
          tags: ['Wheel Contents'],
          summary: 'Cập nhật lựa chọn',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    label: { type: 'string' },
                    description: { type: 'string' },
                    color: { type: 'string' },
                    weight: { type: 'number' },
                    isActive: { type: 'boolean' },
                    image: { type: 'string', format: 'binary' },
                  },
                },
              },
            },
          },
          responses: { '200': { description: 'Cập nhật thành công' } },
        },
        delete: {
          tags: ['Wheel Contents'],
          summary: 'Xóa lựa chọn',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Xóa thành công' } },
        },
      },
      // ── SPIN HISTORY ──
      '/spin-history': {
        post: {
          tags: ['Spin History'],
          summary: 'Ghi nhận kết quả quay (tạo decision)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['categoryId', 'selectedContentId'],
                  properties: {
                    categoryId: { type: 'string' },
                    selectedContentId: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Spin recorded, trả về history + streak mới' } },
        },
        get: {
          tags: ['Spin History'],
          summary: 'Lịch sử quay của user',
          parameters: [
            { name: 'categoryId', in: 'query', schema: { type: 'string' }, description: 'Lọc theo danh mục' },
            { name: 'page', in: 'query', schema: { type: 'number' } },
            { name: 'limit', in: 'query', schema: { type: 'number' } },
          ],
          responses: { '200': { description: 'Spin history list' } },
        },
      },
      '/spin-history/streak': {
        get: {
          tags: ['Spin History'],
          summary: 'Thông tin streak của user',
          parameters: [
            { name: 'categoryId', in: 'query', schema: { type: 'string' }, description: 'Lọc streak theo danh mục' },
          ],
          responses: { '200': { description: 'Streak info per category' } },
        },
      },
      '/spin-history/stats/{categoryId}': {
        get: {
          tags: ['Spin History'],
          summary: 'Thống kê lựa chọn được chọn nhiều nhất',
          parameters: [{ name: 'categoryId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Content selection stats' } },
        },
      },
      // ── DASHBOARD ──
      '/dashboard/stats': {
        get: {
          tags: ['Dashboard'],
          summary: 'Thống kê tổng quan hệ thống',
          responses: {
            '200': {
              description: 'System stats: totals, usersByRole, activity, system info',
            },
          },
        },
      },
      // ── ROLES ──
      '/roles': {
        get: { tags: ['Roles'], summary: 'Danh sách vai trò', responses: { '200': { description: 'Roles list' } } },
        post: {
          tags: ['Roles'],
          summary: 'Tạo vai trò mới',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'label', 'permissions'],
                  properties: {
                    name: { type: 'string', example: 'moderator' },
                    label: { type: 'string', example: 'Moderator' },
                    permissions: { type: 'array', items: { type: 'string' } },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Role created' } },
        },
      },
      '/roles/{id}': {
        put: {
          tags: ['Roles'],
          summary: 'Cập nhật vai trò',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Roles'],
          summary: 'Xóa vai trò',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },
      // ── PERMISSIONS ──
      '/permissions': {
        get: { tags: ['Permissions'], summary: 'Danh sách quyền hạn', responses: { '200': { description: 'Permissions list' } } },
        post: {
          tags: ['Permissions'],
          summary: 'Tạo quyền hạn mới',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['slug', 'label', 'module'],
                  properties: {
                    slug: { type: 'string', example: 'manage_reports' },
                    label: { type: 'string', example: 'Manage Reports' },
                    module: { type: 'string', example: 'reports' },
                    description: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Permission created' } },
        },
      },
      '/permissions/{id}': {
        delete: {
          tags: ['Permissions'],
          summary: 'Xóa quyền hạn',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
