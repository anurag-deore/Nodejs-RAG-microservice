# File Upload Service

A standalone microservice for handling file uploads with Redis Pub/Sub integration.

## Features

- File upload endpoint with CSV file validation
- Redis Pub/Sub integration for file upload events
- Configurable through environment variables
- Docker support
- Logging with Winston

## Prerequisites

- Node.js 18+
- Redis server
- Docker (optional)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```env
PORT=3001
NODE_ENV=development
UPLOAD_DIR=uploads
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Running the Service

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Docker

Build the image:

```bash
docker build -t file-upload-service .
```

Run the container:

```bash
docker run -d \
  -p 3001:3001 \
  -v $(pwd)/uploads:/app/uploads \
  --env-file .env \
  file-upload-service
```

## API Endpoints

### Upload File

```
POST /upload
Content-Type: multipart/form-data

Form field: file (CSV file)
```

### Health Check

```
GET /health
```

## Redis Events

The service publishes a `file_uploaded` event to Redis when a file is successfully uploaded. The event payload includes:

```json
{
  "filename": "uploaded_file.csv",
  "path": "/absolute/path/to/file",
  "timestamp": "2025-02-26T12:00:00Z"
}
```
