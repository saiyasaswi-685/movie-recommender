---

# 🎬 Resilient Movie Recommendation System

A fault-tolerant movie recommendation engine designed to demonstrate **high availability**, **failure isolation**, and **cascading failure prevention** using the **Circuit Breaker Pattern**.

---

## 📺 Video Demonstration

Watch the full architectural walk-through and live simulation of the circuit breaker states:

**[Click here to watch the Demo on YouTube](https://youtu.be/XfNCyGB--jU)**

---

## 🎯 Objective

The objective of this project is to build a resilient distributed system where the primary **Recommendation Service** continues functioning even when dependent services (User Profile or Content) become slow, unavailable, or fail completely.

**Key Resilience Features:**

* **Failure Thresholds:** Automatically trips after 5 consecutive failures.
* **Timeout Handling:** Cuts connections after 2 seconds to prevent hanging.
* **Automatic Recovery:** 30-second cooldown before attempting self-healing.
* **Graceful Degradation:** Serves default preferences or trending data during outages.

---

## 🏗️ System Architecture

The system consists of four containerized microservices communicating over a private Docker network:

1. **Recommendation Service (Port 8080):** The central orchestrator/gateway.
2. **User Profile Service (Port 8081):** Mock service for user preferences.
3. **Content Service (Port 8082):** Mock service for movie metadata.
4. **Trending Service (Port 8083):** High-availability fallback service.

---

## 🚦 Circuit Breaker States (Opossum Implementation)

| State | Behavior |
| --- | --- |
| **🟢 CLOSED** | Normal operation. Requests flow to dependent services. |
| **🔴 OPEN** | Threshold exceeded. Requests **fail-fast** immediately to fallback logic. |
| **🟡 HALF-OPEN** | After 30s cooldown. Allows a trial request to check if the service recovered. |

---

## 🚀 Quick Start

### Prerequisites

* Docker & Docker Compose
* Git

### Setup & Run

```bash
# 1. Clone the repo
git clone https://github.com/saiyasaswi-685/movie-recommender.git
cd movie-recommender

# 2. Setup environment variables
cp .env.example .env

# 3. Build and Start the services
docker-compose up --build -d

```

---

## 🧪 Testing & Verification Guide

### 1. Healthy State

* **URL:** `http://localhost:8080/recommendations/123`
* **Expected:** Full JSON response with user data and personalized movies.
* **Metrics:** `http://localhost:8080/metrics/circuit-breakers` shows `CLOSED`.

### 2. Trigger Failure (Graceful Degradation)

```bash
# Simulate a failure in User Service
curl -X POST http://localhost:8080/simulate/user-profile/fail

```

* **Action:** Refresh the Recommendation URL **5 times**.
* **Result:** State changes to `OPEN`. You will see `userId: "default"` and `fallback: true` in the response.

### 3. Critical Fallback (Trending Service)

```bash
# Simulate failure in Content Service as well
curl -X POST http://localhost:8080/simulate/content/fail

```

* **Result:** System returns **Trending Movies** with a message: *"Service temporarily degraded."*

### 4. Automatic Self-Healing

```bash
# Restore User Service to normal
curl -X POST http://localhost:8080/simulate/user-profile/normal

```

* **Action:** Wait **30 seconds** and refresh.
* **Result:** Breaker moves to `HALF_OPEN` then `CLOSED` once the request succeeds.

---

## 📊 Monitoring Endpoint

The system provides a real-time observability endpoint to monitor the health of all circuit breakers:
`GET http://localhost:8080/metrics/circuit-breakers`

**Sample Output:**

```json
{
  "userProfileCircuitBreaker": {
    "state": "OPEN",
    "successfulCalls": 10,
    "failedCalls": 5
  },
  "contentCircuitBreaker": {
    "state": "CLOSED",
    "successfulCalls": 15,
    "failedCalls": 0
  }
}

```

---

## 📂 Repository Structure

```text
.
├── recommendation-service/   # Gateway with Circuit Breaker logic
├── user-profile-service/     # Mock User API with Simulation logic
├── content-service/          # Mock Content API
├── trending-service/         # Fallback Service
├── docker-compose.yml        # Orchestration
└── .env.example              # Template for Config

```

---

## 🧠 Key Concepts Demonstrated

* **Microservices Orchestration:** Using Docker Compose.
* **Fault Tolerance:** Preventing cascading failures via Opossum.
* **Graceful Degradation:** Providing partial functionality instead of a 500 error.
* **Observability:** Custom metrics for distributed state monitoring.

---

## 💡 Conclusion

This project proves that resilient design patterns like **Circuit Breakers** are essential for distributed systems. By isolating failures and implementing fail-fast strategies, we ensure that the user experience remains stable even during partial system outages.

---

**Developed by [Sai Yasaswi**](https://www.google.com/search?q=https://github.com/saiyasaswi-685)