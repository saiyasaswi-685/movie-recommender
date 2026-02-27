
---

````markdown
# 🎬 Resilient Movie Recommendation System

[![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)](https://github.com/saiyasaswi-685/movie-recommender)
[![Pattern](https://img.shields.io/badge/Resilience-Circuit%20Breaker-green)]()

A fault-tolerant movie recommendation engine designed to demonstrate high availability, failure isolation, and cascading failure prevention using the **Circuit Breaker Pattern**.

---

## 🎯 Objective

The objective of this project is to build a resilient distributed system where the primary **Recommendation Service** continues functioning even when its dependent services (**User Profile Service** and **Content Service**) become slow, unavailable, or fail completely.

This is achieved by implementing state-aware Circuit Breakers that handle:

- Failure thresholds  
- Timeout management  
- Automatic recovery  
- Graceful degradation  

---

## 🏗️ System Architecture

The system consists of four containerized microservices communicating over a private Docker network:

1. **Recommendation Service (Port 8080)**  
   The core orchestrator that aggregates user preferences and content metadata.

2. **User Profile Service (Port 8081)**  
   A mock service that provides user preferences.

3. **Content Service (Port 8082)**  
   A mock service that provides movie metadata.

4. **Trending Service (Port 8083)**  
   A high-availability fallback service providing trending movie recommendations.

---

## 🚦 Circuit Breaker Implementation

Each dependent service is protected by an independent Circuit Breaker implementing the following states:

### 🔹 CLOSED
- Normal operation  
- Requests flow normally to the dependent service  

### 🔹 OPEN
- Triggered when failure threshold is exceeded  
- Requests fail immediately (fail-fast)  
- Prevents resource exhaustion and cascading failures  

### 🔹 HALF-OPEN
- Activated after cooldown period (30 seconds)  
- Allows limited trial requests  
- If successful → transitions to CLOSED  
- If failed → returns to OPEN  

---

## ⚙️ Core Configuration

- **Request Timeout:** 2 seconds  
- **Failure Threshold:**  
  - 5 consecutive failures  
  OR  
  - 50% failure rate within a rolling 10-request window  
- **Cooldown Duration:** 30 seconds  

---

## 🚀 Quick Start

### 1️⃣ Prerequisites

- Docker  
- Docker Compose  

### 2️⃣ Setup

Clone the repository and prepare the environment:

```bash
git clone https://github.com/saiyasaswi-685/movie-recommender.git
cd movie-recommender
cp .env.example .env
````

### 3️⃣ Run the Application

Start all services:

```bash
docker-compose up --build
```

---

## 🧪 Testing & Verification Guide

### ✅ Step 1: Normal Operation

Access:

```
http://localhost:8080/recommendations/1
```

**Expected Result:**
A full JSON response containing user preferences and personalized movie recommendations.

---

### ⚠️ Step 2: Trigger Graceful Degradation

Simulate failure in the User Profile Service:

```bash
curl -X POST http://localhost:8080/simulate/user-profile/fail
```

Refresh the recommendations endpoint multiple times.

**Expected Result:**

* Circuit transitions to OPEN
* Response includes:

  * `"userId": "default"`
  * `"fallback": true`

---

### 🔥 Step 3: Trigger Critical Fallback

Simulate failure in both User and Content services:

```bash
curl -X POST http://localhost:8080/simulate/content/fail
```

**Expected Result:**
System returns trending movies from the `trending-service` with a degradation message.

---

### 🔄 Step 4: Automatic Recovery

1. Restore services:

   ```bash
   curl -X POST http://localhost:8080/simulate/user-profile/normal
   ```
2. Wait 30 seconds (cooldown period)
3. Refresh the recommendations endpoint

**Expected Result:**
Circuit transitions from HALF-OPEN to CLOSED and resumes normal behavior.

---

### 📊 Step 5: Monitor Circuit Status

Check real-time breaker metrics:

```
GET http://localhost:8080/metrics/circuit-breakers
```

---

## 📂 Repository Structure

* `/recommendation-service` → Orchestration logic & circuit breaker implementation
* `/user-profile-service` → Mock user preference API
* `/content-service` → Mock movie metadata API
* `/trending-service` → High-availability fallback service
* `docker-compose.yml` → Full stack container orchestration
* `.env.example` → Environment configuration template

---

## 🧠 Key Concepts Demonstrated

* Microservices Architecture
* Circuit Breaker Pattern
* Graceful Degradation
* Fail-Fast Strategy
* Automatic Recovery
* Docker-based Deployment

---

## 💡 Conclusion

This project demonstrates how resilient design patterns like Circuit Breakers improve reliability in distributed systems by isolating failures, preventing cascading outages, and ensuring service continuity under stress conditions.

```

---

```
