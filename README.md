# Weather API

Simple Weather API built with **Node.js**, **Express**, **TypeScript**, and **Redis**.
Supports **current weather** and **multi-day forecast**, with caching in Redis.

---

## Features

* `/weather/current?city=CityName` — get current weather
* `/weather/forecast?city=CityName&days=N` — get forecast for N days (default 3)
* Redis caching with TTL (`CACHE_TTL` in seconds)
* Source indicator: `"service"` or `"cache"`

---

## Setup

1. Clone the repo:

```bash
git clone https://github.com/mykytapilec/weather-api.git
cd weather-api
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` based on `.env.example` and add your API key:

```bash
cp .env.example .env
```

Edit `.env` as needed:

```env
PORT=3000
WEATHER_API_KEY=your_visualcrossing_api_key
WEATHER_API_URL=https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata
REDIS_URL=redis://localhost:6379
CACHE_TTL=43200
```

4. Run Redis (for caching):

```bash
docker run -p 6379:6379 redis
```

5. Run in development:

```bash
npm run dev
```

Server will be available at: `http://localhost:3000`

---

## API Endpoints

### 1️⃣ Current Weather

**Request:**

```bash
curl "http://localhost:3000/weather/current?city=London"
```

**Response:**

```json
{
  "data": {
    "city": "London",
    "temperature": 20,
    "condition": "Sunny"
  },
  "source": "service"
}
```

* Repeated request returns:

```json
{
  "data": {
    "city": "London",
    "temperature": 20,
    "condition": "Sunny"
  },
  "source": "cache"
}
```

---

### 2️⃣ Multi-Day Forecast

**Request (3 days by default):**

```bash
curl "http://localhost:3000/weather/forecast?city=Paris&days=3"
```

**Response:**

```json
{
  "data": {
    "city": "Paris",
    "forecast": [
      { "date": "2026-03-10", "temperature": 20, "condition": "Sunny" },
      { "date": "2026-03-11", "temperature": 21, "condition": "Cloudy" },
      { "date": "2026-03-12", "temperature": 22, "condition": "Rainy" }
    ]
  },
  "source": "service"
}
```

* Repeated request returns `source: "cache"`.

---

## Project Structure

```
src/
├─ app.ts           # Main server
├─ routes/
│  └─ weatherRoutes.ts   # Routes
├─ controllers/
│  └─ weatherController.ts # Controllers
├─ services/
│  └─ weatherService.ts  # Service layer (weather logic + Redis caching)
├─ utils/
│  └─ (optional utils like Redis client)
```

---

## Environment Variables

| Variable        | Description                           | Default / Example      |
| --------------- | ------------------------------------- | ---------------------- |
| PORT            | Server port                           | 3000                   |
| WEATHER_API_KEY | API key for 3rd-party weather service | your key               |
| WEATHER_API_URL | URL of 3rd-party weather API          | Visual Crossing        |
| REDIS_URL       | Redis connection string               | redis://localhost:6379 |
| CACHE_TTL       | Cache expiration time in seconds      | 43200 (12h)            |

---

## Notes

* Currently, weather data is **mocked** (temperature + condition). You can replace the mock with a **real API call** to Visual Crossing or another provider.
* Redis caching ensures repeated requests are **fast** and do not hit the API unnecessarily.
* The `source` field indicates where the data came from: `"service"` for fresh data, `"cache"` if returned from Redis.

