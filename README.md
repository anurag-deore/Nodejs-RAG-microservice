# **AI-Powered CSV Query Microservices App**

## **Overview**

This project is a microservices-based application that allows users to upload CSV files and use AI to query and analyze the data. The system leverages vector databases, AI embeddings, and Redis Pub/Sub for efficient data processing. The architecture is designed to be scalable, containerized with Docker, and deployable in Kubernetes.

---

## **Features**

- Upload CSV files and track processing status
- Store metadata of uploaded datasets in PostgreSQL
- Vectorize text data and store embeddings in Qdrant
- AI-powered query engine to answer user questions about the data
- Redis Pub/Sub for asynchronous processing
- API Gateway for unified access to microservices
- Kubernetes for deployment and autoscaling

---

## **Architecture**

### **Microservices Overview**

1. **File Upload Service**: Handles file uploads, extracts metadata, and triggers processing.
2. **Data Processing Service**: Reads CSV files, generates embeddings using `nomic-embed-text`, and stores them in Qdrant.
3. **AI Query Service**: Uses an AI model (`Qwen 2.5 7B`) via Ollama to answer user queries.
4. **Metadata Store (PostgreSQL)**: Stores information about uploaded datasets.
5. **Vector Database (Qdrant)**: Stores embeddings for efficient retrieval.
6. **Redis Pub/Sub**: Manages event-driven communication between services.
7. **API Gateway**: Centralized entry point for the frontend and services.
8. **Frontend (React + TypeScript)**: Provides a user interface for uploading files and querying data.

### **Workflow**

1. User uploads a CSV file via the frontend.
2. File Upload Service stores metadata in PostgreSQL and publishes an event to Redis.
3. Data Processing Service consumes the event, processes the CSV, generates embeddings, and stores them in Qdrant.
4. Metadata status is updated as `ready` in PostgreSQL after processing.
5. User queries the dataset, and AI Query Service retrieves relevant data using vector search in Qdrant.
6. AI Query Service sends context to the AI model (running via Ollama on a different machine) and returns structured responses.

---

## **Current Status**

### Completed

- **File Upload Service**: Uploading CSV files, generating embeddings, and storing in Qdrant.
- **AI Query Service**: Using an AI model to answer user queries.
- **Data Prep Service**: Reading CSV files, generating embeddings, and storing in Qdrant.
- **Redis Pub/Sub**: (Running in docker) Managing event-driven communication between services.

### In Progress

- **API Gateway**: Centralized entry point for the frontend and services.
- **Frontend (React + TypeScript)**: Providing a user interface for uploading files and querying data.

## **Future Enhancements**

- Add support to retrieve Actual Data from the CSV file.
- Optimize query response ranking with hybrid search.
- Add support for Contextual Querying.
- Add support for different AI models.

---

## **Installation & Setup**

### **Prerequisites**

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Kubernetes (Minikube or k3s)](https://kubernetes.io/)
- [Node.js](https://nodejs.org/)
- [Redis](https://redis.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Qdrant](https://qdrant.tech/)
- [Ollama](https://ollama.ai/)

### **Clone the Repository**

```sh
git clone https://github.com/your-repo.git
cd your-repo
```

### **Run Services with Docker Compose**

```sh
docker-compose up -d
```

This will start all services including PostgreSQL, Redis, Qdrant, and the microservices.

### **Manually Running Individual Microservices**

Each microservice has its own `package.json`. To run a service locally:

```sh
cd services/file-upload
npm install
npm start
```

Repeat for other microservices.

### **Accessing the Services**

- **Frontend**: `http://localhost:3000`
- **API Gateway**: `http://localhost:8080`
- **PostgreSQL Admin**: `http://localhost:5432`
- **Qdrant UI**: `http://localhost:6333`
- **Redis CLI**: `redis-cli`

---

## **Environment Variables**

Each microservice requires environment variables. Create a `.env` file in each service directory.

Example `.env` for **File Upload Service**:

```env
PORT=5001
POSTGRES_URL=postgres://user:password@localhost:5432/dbname
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## **Testing & Debugging**

### **Testing APIs with cURL**

Upload a CSV file:

```sh
curl -X POST -F "file=@data.csv" http://localhost:5001/upload
```

Query the AI Service:

```sh
curl -X POST http://localhost:5003/query -H "Content-Type: application/json" -d '{"dataset_id": "123", "query": "What do people like about the phone?"}'
```

### **Checking Redis Events**

```sh
redis-cli
SUBSCRIBE dataset_processing
```

---

---

## **Contributing**

Contributions are welcome! Fork the repo and submit a PR.

---

## **License**

MIT License. See `LICENSE` for details.
