# AppDich Backend

Backend API cho ứng dụng dịch thuật AppDich, sử dụng Node.js, Express và MongoDB.

## Cài đặt

1. Cài đặt dependencies:
```bash
cd backend
npm install
```

2. Cấu hình MongoDB:
- Thay thế `<db_password>` trong file `config.js` bằng mật khẩu thực tế của bạn
- Hoặc tạo file `.env` với nội dung:
```
MONGODB_URI=mongodb+srv://caoman26_db_user:YOUR_PASSWORD@cluster0.nulruvo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
```

3. Chạy server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Kiểm tra trạng thái server

### Translations
- `POST /api/translations` - Lưu bản dịch mới
- `GET /api/translations` - Lấy danh sách lịch sử dịch
- `GET /api/translations/:id` - Lấy bản dịch cụ thể
- `DELETE /api/translations/:id` - Xóa bản dịch
- `DELETE /api/translations/user/:userId` - Xóa tất cả lịch sử của user

## Cấu trúc dữ liệu

### Translation Schema
```javascript
{
  originalText: String,        // Văn bản gốc
  translatedText: String,      // Văn bản đã dịch
  sourceLanguage: String,      // Ngôn ngữ nguồn (mặc định: 'auto')
  targetLanguage: String,      // Ngôn ngữ đích
  translationMethod: String,   // 'voice' hoặc 'manual'
  timestamp: Date,            // Thời gian tạo
  userId: String              // ID người dùng (mặc định: 'anonymous')
}
```

## Sử dụng

### Lưu bản dịch
```javascript
POST /api/translations
Content-Type: application/json

{
  "originalText": "Hello world",
  "translatedText": "Xin chào thế giới",
  "targetLanguage": "vi",
  "translationMethod": "manual"
}
```

### Lấy lịch sử dịch
```javascript
GET /api/translations?userId=anonymous&limit=50&page=1
```

## Kết nối với Frontend

Frontend React Native sẽ gọi API tại `http://localhost:3000/api` khi chạy trên máy local, hoặc thay đổi URL trong file `src/api.ts` để trỏ đến server production.


