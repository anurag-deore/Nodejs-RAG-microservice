# AI Query Microservice

A Node.js Express microservice that processes natural language queries using embeddings, vector search, and LLM-based response generation.

## Features

- Query processing with semantic understanding
- Vector similarity search using Qdrant
- LLM-powered response generation with Ollama
- Redis caching for frequently asked queries
- TypeScript for type safety
- Error handling and logging

## Prerequisites

- Node.js 18+ and npm
- Redis server
- Qdrant vector database
- Ollama running locally with the qwen:7b model

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd aiqueryms
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

4. Build the project:

```bash
npm run build
```

5. Start the service:

```bash
npm start
```

For development with hot reload:

```bash
npm run dev
```

## API Endpoints

### POST /query

Process a natural language query and return an AI-generated response.

Request:

```json
{
  "query": "What do people like about the phone?"
}
```

Response:

```json
{
  "response": "Based on the reviews, people particularly appreciate..."
}
```

### GET /health

Check the service health status.

Response:

```json
{
  "status": "OK"
}
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `QDRANT_URL`: Qdrant server URL
- `QDRANT_COLLECTION`: Qdrant collection name
- `OLLAMA_API`: Ollama API endpoint
- `OLLAMA_MODEL`: Ollama model name
- `REDIS_HOST`: Redis server host
- `REDIS_PORT`: Redis server port
- `REDIS_TTL`: Cache TTL in seconds
- `EMBEDDING_DIMENSION`: Embedding vector dimension
- `TOP_K`: Number of similar results to retrieve

## Architecture

1. Query Processing:

   - Convert user query to embedding vector
   - Search similar vectors in Qdrant
   - Rank and filter results
   - Generate response using Ollama LLM
   - Cache results in Redis

2. Caching:
   - Redis is used to cache query-response pairs
   - Configurable TTL for cache entries
   - Improves response time for frequent queries

## Error Handling

The service includes comprehensive error handling:

- Input validation
- API error handling
- Service-level error handling
- Logging with Winston

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC
