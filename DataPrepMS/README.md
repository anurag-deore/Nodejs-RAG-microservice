# Data Processing Microservice

A scalable microservice for processing CSV files, generating embeddings using Ollama (Qwen 2.5-7B), and storing them in Qdrant vector database.

## 🚀 Features

- Redis Pub/Sub for event-driven processing
- CSV file processing with streaming support
- Embedding generation using Ollama (Qwen 2.5-7B)
- Vector storage in Qdrant
- Structured logging with Winston
- Docker support
- Health check endpoint

## 🛠 Prerequisites

- Node.js 18+
- Redis server
- Qdrant server
- Ollama with Qwen 2.5-7B model

## 🔧 Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Qdrant Configuration
QDRANT_URL=http://localhost:6334
QDRANT_COLLECTION=dataset_embeddings

# Ollama Configuration
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=qwen:7b

# Logging
LOG_LEVEL=info
```

## 📦 Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start the service
npm start
```

## 🐳 Docker

```bash
# Build Docker image
docker build -t data-processing-service .

# Run container
docker run -p 3000:3000 --env-file .env data-processing-service
```

## 📝 API

### Health Check

```
GET /health
Response: { "status": "healthy" }
```

### Redis Events

1. **Incoming Event (Subscribe)**

   - Channel: `file_uploaded`
   - Payload: `{ "filePath": "path/to/file.csv" }`

2. **Outgoing Event (Publish)**
   - Channel: `dataset_ready`
   - Payload: `{ "filename": "file.csv", "rows": 100, "timestamp": 1234567890 }`

## 📊 Flow

1. External service uploads CSV file and publishes to `file_uploaded`
2. Service processes CSV file and generates embeddings
3. Embeddings are stored in Qdrant with metadata
4. Service publishes completion event to `dataset_ready`

## 🔍 Logging

Logs are written to:

- `combined.log`: All logs
- `error.log`: Error logs only
- Console: Based on LOG_LEVEL

## ⚙️ Development

```bash
# Run in development mode
npm run dev

# Build TypeScript
npm run build

# Check for linting errors
npm run lint
```

## 📄 License

MIT
