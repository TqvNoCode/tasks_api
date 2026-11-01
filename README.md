# Tasks API (Club project)

## 📌 Giới thiệu & Bản quyền nguồn tham khảo (Attribution)

> [!NOTE]
> Project này được kế thừa và phát triển dựa trên mã nguồn nền tảng của **[NestJS Boilerplate](https://github.com/dscdut/nestjs-boilerplate)**.
>
---

## Hướng dẫn cài đặt (Installation)

Sử dụng Git để clone repository về máy cục bộ và di chuyển vào thư mục dự án:

```bash
# Clone repository
git clone https://github.com/dscdut/nestjs-boilerplate.git

# Di chuyển vào thư mục dự án
cd nestjs-boilerplate
```

---

## Yêu cầu hệ thống (Prerequisites)

Trước khi tiến hành cài đặt, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

- **Node.js**: Phiên bản `>= 16.x` (khuyến nghị `18.x` hoặc `20.x LTS`)
- **npm**: Phiên bản `>= 8.x`
- **Docker & Docker Compose**: Dùng để khởi chạy container cơ sở dữ liệu PostgreSQL (hoặc cài đặt PostgreSQL cục bộ)

Kiểm tra phiên bản cài đặt trên máy:
```bash
node -v
npm -v
docker -v
docker compose version
```

---

### Bước 1: Cài đặt các gói phụ thuộc (Dependencies)

```bash
npm install
```

### Bước 2: Thiết lập file môi trường (.env)

Tạo file `.env` từ file mẫu `.env.example`:

```bash
cp .env.example .env
```

### Bước 3: Chạy docker
Bạn có thể khởi động container cơ sở dữ liệu thông qua Docker Compose:

```bash
docker compose up -d db
```

### Bước 4: Chạy Migration để tạo bảng dữ liệu Tasks

Thực thi TypeORM migration để tạo cấu trúc bảng `tasks` với khóa chính `id SERIAL` (tự động tăng từ 1):

```bash
npm run typeorm:run-migrations
```

---

## Chạy ứng dụng

```bash
# Chế độ phát triển (Development mode với Hot-reload)
npm run start:dev

# Chế độ Build và chạy Production
npm run build
npm run start:prod
```

Sau khi ứng dụng khởi chạy thành công:
- **API Base URL**: `http://localhost:3000/api/v1/tasks`
- **Tài liệu Swagger UI**: `http://localhost:3000/api/docs`

---

## Hướng dẫn sử dụng Tasks API

Module **Tasks API** cung cấp đầy đủ các thao tác CRUD cho công việc cá nhân, hỗ trợ phân loại và lọc theo trạng thái hoàn thành.

### 1. Mô hình dữ liệu (Data Model)

Bảng cơ sở dữ liệu `tasks`:

| Tên trường | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `integer` | Tự động | `SERIAL` (1, 2, 3,...) | Khóa chính tự tăng |
| `title` | `string` | **Có** | - | Tiêu đề công việc (độ dài: 1 - 255 ký tự) |
| `category` | `string` | Không | `null` | Phân loại / danh mục công việc |
| `description` | `string` | Không | `null` | Mô tả chi tiết công việc |
| `isCompleted` | `boolean` | Không | `false` | Trạng thái hoàn thành |
| `createdAt` | `timestamp` | Tự động | `NOW()` | Thời gian tạo |
| `updatedAt` | `timestamp` | Tự động | `NOW()` | Thời gian cập nhật lần cuối |

---

### 2. Danh sách Endpoints

| Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `POST` | `/api/v1/tasks` | Tạo mới một task |
| `GET` | `/api/v1/tasks` | Lấy danh sách tasks (hỗ trợ lọc theo `isCompleted`, `category`) |
| `GET` | `/api/v1/tasks/:id` | Xem thông tin chi tiết một task theo ID |
| `PATCH` | `/api/v1/tasks/:id` | Cập nhật thông tin task theo ID |
| `DELETE` | `/api/v1/tasks/:id` | Xóa task theo ID |

---

### 3. Chi tiết Endpoints & Ví dụ cURL

#### 1. Tạo task mới (Create Task)
- **Endpoint**: `POST /api/v1/tasks`
- **Headers**: `Content-Type: application/json`

**Ví dụ Request cURL**:
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Học kiến trúc NestJS",
    "category": "Backend",
    "description": "Nghiên cứu Controller, Service, DTO và TypeORM",
    "isCompleted": false
  }'
```

**Response thành công (`201 Created`)**:
```json
{
  "id": 1,
  "title": "Học kiến trúc NestJS",
  "category": "Backend",
  "description": "Nghiên cứu Controller, Service, DTO và TypeORM",
  "isCompleted": false,
  "createdAt": "2026-11-01T08:00:00.000Z",
  "updatedAt": "2026-11-01T08:00:00.000Z"
}
```

---

#### 2. Lấy danh sách tasks (Get Tasks with Filters)
- **Endpoint**: `GET /api/v1/tasks`
- **Query Parameters (tùy chọn)**:
  - `isCompleted`: `true` hoặc `false`
  - `category`: Tên danh mục cần lọc (chuỗi ký tự)

**Ví dụ cURL**:
```bash
# Lấy toàn bộ danh sách task
curl -X GET http://localhost:3000/api/v1/tasks

# Lọc các task chưa hoàn thành
curl -X GET "http://localhost:3000/api/v1/tasks?isCompleted=false"

# Lọc theo chuyên mục Backend
curl -X GET "http://localhost:3000/api/v1/tasks?category=Backend"

# Kết hợp cả 2 bộ lọc
curl -X GET "http://localhost:3000/api/v1/tasks?isCompleted=true&category=Backend"
```

**Response thành công (`200 OK`)**:
```json
[
  {
    "id": 1,
    "title": "Học kiến trúc NestJS",
    "category": "Backend",
    "description": "Nghiên cứu Controller, Service, DTO và TypeORM",
    "isCompleted": false,
    "createdAt": "2026-11-01T08:00:00.000Z",
    "updatedAt": "2026-11-01T08:00:00.000Z"
  }
]
```

---

#### 3. Xem chi tiết task theo ID (Get Task by ID)
- **Endpoint**: `GET /api/v1/tasks/:id`
- **Tham số `:id`**: Số nguyên dương (ví dụ: `1`, `2`)

**Ví dụ cURL**:
```bash
curl -X GET http://localhost:3000/api/v1/tasks/1
```

**Response thành công (`200 OK`)**:
```json
{
  "id": 1,
  "title": "Học kiến trúc NestJS",
  "category": "Backend",
  "description": "Nghiên cứu Controller, Service, DTO và TypeORM",
  "isCompleted": false,
  "createdAt": "2026-11-01T08:00:00.000Z",
  "updatedAt": "2026-11-01T08:00:00.000Z"
}
```

---

#### 4. Cập nhật task (Update Task)
- **Endpoint**: `PATCH /api/v1/tasks/:id`
- **Body**: Cho phép cập nhật từng trường riêng lẻ (`title`, `category`, `description`, `isCompleted`).

**Ví dụ cURL**:
```bash
curl -X PATCH http://localhost:3000/api/v1/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hoàn thành bài tập NestJS",
    "isCompleted": true
  }'
```

**Response thành công (`200 OK`)**:
```json
{
  "id": 1,
  "title": "Hoàn thành bài tập NestJS",
  "category": "Backend",
  "description": "Nghiên cứu Controller, Service, DTO và TypeORM",
  "isCompleted": true,
  "createdAt": "2026-11-01T08:00:00.000Z",
  "updatedAt": "2026-11-01T08:30:00.000Z"
}
```

---

#### 5. Xóa task (Delete Task)
- **Endpoint**: `DELETE /api/v1/tasks/:id`
- **Tham số `:id`**: Số nguyên dương

**Ví dụ cURL**:
```bash
curl -X DELETE http://localhost:3000/api/v1/tasks/1
```

**Response thành công (`200 OK`)**:
```json
{
  "message": "Task deleted successfully"
}
```

---

### 4. Quy tắc Validation & Mã lỗi

| Trạng thái HTTP | Tình huống | Mô tả phản hồi |
| :--- | :--- | :--- |
| `200 OK` | Lấy dữ liệu, cập nhật hoặc xóa thành công | Trả về dữ liệu đối tượng hoặc thông điệp |
| `201 Created` | Tạo task mới thành công | Trả về task kèm ID tự sinh |
| `400 Bad Request` | Dữ liệu đầu vào sai (thiếu `title`, `title` rỗng, sai kiểu dữ liệu) | `{"statusCode": 400, "message": [...], "error": "Bad Request"}` |
| `404 Not Found` | Không tìm thấy task với ID chỉ định (hoặc ID không hợp lệ) | `{"statusCode": 404, "message": "Tasks with ID {id} not found"}` |
| `500 Internal Server Error` | Lỗi kết nối cơ sở dữ liệu hoặc lỗi server nội bộ | Xử lý qua Global Exception Filter |

---

## Cấu trúc thư mục (File Structure)

Dưới đây là cấu trúc các tệp tin trong dự án, đặc biệt làm nổi bật các thành phần trực tiếp cấu thành **Tasks API**:

```text
nestjs-boilerplate/
├── src/
│   ├── modules/
│   │   └── tasks/                            # Module Tasks API chính
│   │       ├── dto/                          # Định nghĩa dữ liệu truyền vào (DTO)
│   │       │   ├── create-task.dto.ts        # DTO tạo mới task (validation title, category...)
│   │       │   ├── update-task.dto.ts        # DTO cập nhật task
│   │       │   └── filter-task.dto.ts        # DTO lọc tasks qua Query Parameters
│   │       ├── tasks.controller.ts           # Controller tiếp nhận & xử lý HTTP requests
│   │       ├── tasks.controller.spec.ts      # Unit test cho Tasks Controller
│   │       ├── tasks.service.ts              # Service chứa logic xử lý nghiệp vụ & TypeORM
│   │       ├── tasks.service.spec.ts         # Unit test cho Tasks Service
│   │       ├── tasks.validation.spec.ts      # Unit test kiểm tra validation DTOs
│   │       └── tasks.module.ts               # Khai báo TasksModule
│   ├── database/
│   │   └── typeorm/
│   │       ├── entities/
│   │       │   └── task.entity.ts            # Thực thể Task Entity (ánh xạ bảng tasks)
│   │       ├── migrations/
│   │       │   └── 1730370000000-create-tasks-table.ts # Migration tạo bảng tasks và sequence ID
│   │       └── config.ts                     # Cấu hình TypeORM DataSource
│   ├── core/                                 # Hệ thống log, filter, pagination dùng chung
│   ├── shared/                               # Middleware, decorator, shared module
│   ├── app.module.ts                         # Root Module kết nối các modules
│   ├── main.ts                               # Bootstrap ứng dụng, cấu hình Swagger, Global Pipe
│   └── setup-swagger.ts                      # Cấu hình tài liệu Swagger API
├── docker-compose.yml                        # Docker compose khởi chạy PostgreSQL
├── package.json                              # Quản lý dependencies & npm scripts
├── tsconfig.json                             # Cấu hình TypeScript
├── .env.example                              # File cấu hình biến môi trường mẫu
└── README.md                                 # Tài liệu hướng dẫn sử dụng dự án
```

### Chi tiết các file của Tasks API:
- **[task.entity.ts](file:///home/tqv/Desktop/GCD_project/nestjs-boilerplate/src/database/typeorm/entities/task.entity.ts)**: Định nghĩa Entity `Task` với các cột `id`, `title`, `category`, `description`, `isCompleted`, `createdAt`, `updatedAt`.
- **[1730370000000-create-tasks-table.ts](file:///home/tqv/Desktop/GCD_project/nestjs-boilerplate/src/database/typeorm/migrations/1730370000000-create-tasks-table.ts)**: Migration khởi tạo bảng `tasks` với trường khóa chính tự tăng `SERIAL` và đồng bộ sequence.
- **[tasks.controller.ts](file:///home/tqv/Desktop/GCD_project/nestjs-boilerplate/src/modules/tasks/tasks.controller.ts)**: Cung cấp 5 REST endpoints chuẩn `/api/v1/tasks`.
- **[tasks.service.ts](file:///home/tqv/Desktop/GCD_project/nestjs-boilerplate/src/modules/tasks/tasks.service.ts)**: Quản lý nghiệp vụ CRUD và tương tác trực tiếp với cơ sở dữ liệu qua TypeORM Repository.
- **[create-task.dto.ts](file:///home/tqv/Desktop/GCD_project/nestjs-boilerplate/src/modules/tasks/dto/create-task.dto.ts)** / **[update-task.dto.ts](file:///home/tqv/Desktop/GCD_project/nestjs-boilerplate/src/modules/tasks/dto/update-task.dto.ts)** / **[filter-task.dto.ts](file:///home/tqv/Desktop/GCD_project/nestjs-boilerplate/src/modules/tasks/dto/filter-task.dto.ts)**: Chứa các quy tắc validation dữ liệu bằng `class-validator` và `class-transformer`.
