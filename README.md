
---

### **Final README.md Template**

```markdown
# Resilient Movie Recommendation System 🎬
[![Microservices](https://img.shields.io/badge/Architecture-Microservices-blue)](https://github.com/saiyasaswi-685/movie-recommender)
[![Resilience](https://img.shields.io/badge/Pattern-Circuit%20Breaker-green)]()

A fault-tolerant recommendation engine built to demonstrate high availability and cascading failure prevention using the **Circuit Breaker Pattern**.

## 🎯 Objective
The goal of this project is to build a resilient distributed system where the primary **Recommendation Service** remains operational even when its dependencies (**User Profile** and **Content Services**) are slow or failing. This is achieved by implementing state-aware proxies (Circuit Breakers) that manage failure thresholds, timeouts, and graceful degradation.

---

## 🏗 System Architecture
The system consists of four containerized microservices communicating over a private Docker network:

1.  **Recommendation Service (Port 8080)**: The orchestrator that fetches user data and matches it with content.
2.  **User-Profile Service (Port 8081)**: Mock service providing user preferences.
3.  **Content Service (Port 8082)**: Mock service providing movie metadata.
4.  **Trending Service (Port 8083)**: A high-reliability service providing generic fallbacks.



---

## 🚦 Circuit Breaker Implementation
The system implements a state machine for each dependency:
* **CLOSED**: Normal operations; requests flow through.
* **OPEN**: Failure threshold exceeded. Requests "fail-fast" to prevent resource exhaustion.
* **HALF-OPEN**: Cooling period (30s) over; allows trial requests to test service health.

### Core Configurations:
- **Request Timeout**: 2 seconds.
- **Failure Threshold**: 5 consecutive timeouts or 50% failure rate in a 10-request window.
- **Cooldown Duration**: 30 seconds.

---

## 🚀 Quick Start

### 1. Prerequisites
- Docker and Docker Compose installed.

### 2. Setup
Clone the repository and prepare the environment:
```bash
git clone [https://github.com/saiyasaswi-685/movie-recommender.git](https://github.com/saiyasaswi-685/movie-recommender.git)
cd movie-recommender
cp .env.example .env

```

### 3. Execution

Start all services with a single command:

```bash
docker-compose up --build

```

---

## 🧪 Verification & Testing Manual

### Step 1: Normal Flow (Requirement #4)

Access `http://localhost:8080/recommendations/1`.

* **Expected**: Full JSON response with user preferences and specific movie recommendations.

### Step 2: Trigger Graceful Degradation (Requirement #8)

Simulate failure in the User Profile service:

```bash
curl -X POST http://localhost:8080/simulate/user-profile/fail

```

Refresh the recommendations endpoint 5-10 times.

* **Expected**: The circuit opens. The response shows `userId: "default"` and `"fallback": true`.

### Step 3: Trigger Critical Fallback (Requirement #9)

Simulate failure in both User and Content services:

```bash
curl -X POST http://localhost:8080/simulate/content/fail

```

* **Expected**: The system returns trending movies (e.g., RRR, Pushpa) from the `trending-service` with a degradation message.

### Step 4: Auto-Recovery (Requirement #10)

1. Restore services: `curl -X POST http://localhost:8080/simulate/user-profile/normal`.
2. Wait **30 seconds**.
3. Refresh the page.

* **Expected**: Circuit transitions from HALF-OPEN to **CLOSED**. Normal data returns.

### Step 5: Monitoring (Requirement #11)

Check real-time status:
`GET http://localhost:8080/metrics/circuit-breakers`

---

## 🛠 Tech Stack & Best Practices

* **Environment Management**: Centralized config via `.env`.
* **Dockerization**: Multi-stage builds for optimized images.
* **Service Discovery**: Internal Docker DNS (e.g., `http://content-service:8082`).
* **Resilience**: Custom Circuit Breaker logic ensuring <50ms response time when circuits are OPEN.

---

## 📂 Repository Contents

* `/recommendation-service`: Logic for orchestration and circuit breakers.
* `/user-profile-service`: Mock user API with simulation controls.
* `/content-service`: Mock movie metadata API.
* `/trending-service`: Reliable fallback provider.
* `docker-compose.yml`: Full stack orchestration.
* `.env.example`: Template for environment variables.

```

---


```