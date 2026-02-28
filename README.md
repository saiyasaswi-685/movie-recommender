````markdown
# 🎬 Resilient Movie Recommendation System

[![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)](https://github.com/saiyasaswi-685/movie-recommender)
[![Resilience](https://img.shields.io/badge/Pattern-Circuit%20Breaker-green)](https://github.com/saiyasaswi-685/movie-recommender)

A fault-tolerant movie recommendation engine designed to demonstrate high availability, failure isolation, and cascading failure prevention using the Circuit Breaker Pattern.

---

## 🎯 Objective

The objective of this project is to build a resilient distributed system where the primary Recommendation Service continues functioning even when its dependent services (User Profile Service and Content Service) become slow, unavailable, or fail completely.

This is achieved by implementing state-aware Circuit Breakers that manage:

- Failure thresholds  
- Timeout handling  
- Automatic recovery  
- Graceful degradation  

---

## 🏗️ System Architecture

The system consists of four containerized microservices communicating over a private Docker network:

1. Recommendation Service (Port 8080)  
   The central orchestrator that aggregates user preferences and content metadata.

2. User Profile Service (Port 8081)  
   A mock service that provides user preferences.

3. Content Service (Port 8082)  
   A mock service that provides movie metadata.

4. Trending Service (Port 8083)  
   A high-availability fallback service that provides trending movie recommendations.

---

## 🚦 Circuit Breaker Implementation

Each dependent service is protected by an independent Circuit Breaker implementing the following states:

### CLOSED
- Normal operation  
- Requests flow normally to the dependent service  

### OPEN
- Triggered when the failure threshold is exceeded  
- Requests fail immediately (fail-fast)  
- Prevents resource exhaustion and cascading failures  

### HALF-OPEN
- Activated after the cooldown period (30 seconds)  
- Allows limited trial requests  
- If successful → transitions to CLOSED  
- If failed → returns to OPEN  

---

## ⚙️ Core Configuration

- Request Timeout: 2 seconds  
- Failure Threshold:  
  - 5 consecutive failures  
  OR  
  - 50% failure rate within a rolling 10-request window  
- Cooldown Duration: 30 seconds  

---

## 🚀 Quick Start

### Prerequisites

- Docker  
- Docker Compose  

### Setup

```bash
git clone https://github.com/saiyasaswi-685/movie-recommender.git
cd movie-recommender
cp .env.example .env
````

### Run the Application

```bash
docker compose up --build
```

---

## 🧪 Testing & Verification Guide

### Step 1: Normal Operation

Access:

```
http://localhost:8080/recommendations/1
```

Expected Result:
A full JSON response containing user preferences and personalized movie recommendations.

---

### Step 2: Trigger Graceful Degradation

```
curl -X POST http://localhost:8080/simulate/user-profile/fail
```

Refresh the recommendations endpoint multiple times.

Expected Result:

* Circuit transitions to OPEN
* Response includes:

  * "userId": "default"
  * "fallback": true

---

### Step 3: Trigger Critical Fallback

```
curl -X POST http://localhost:8080/simulate/content/fail
```

Expected Result:
The system returns trending movies from the trending-service with a degradation message.

---

### Step 4: Automatic Recovery

```
curl -X POST http://localhost:8080/simulate/user-profile/normal
```

Wait 30 seconds and refresh the recommendations endpoint.

Expected Result:
The circuit transitions from HALF-OPEN to CLOSED and resumes normal behavior.

---

### Step 5: Monitor Circuit Status

```
http://localhost:8080/metrics/circuit-breakers
```

---

## 📂 Repository Structure

* /recommendation-service
* /user-profile-service
* /content-service
* /trending-service
* docker-compose.yml
* .env.example

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

````

---



```
