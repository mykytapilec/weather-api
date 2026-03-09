# Weather API

Simple Weather API built with Node.js, Express, TypeScript and Redis.

## Setup

1. Clone the repo:
```bash
git clone https://github.com/mykytapilec/weather-api.git
cd weather-api

2. Install dependencies:
```bash
npm install

3. Create .env based on .env.example and add your API keys.

4. Run in development:
```bash
npm run dev

The API will be available at http://localhost:3000/weather/current.

## Project Structure

src/app.ts — main server
src/routes — routes
src/controllers — controllers
src/services — service layer
src/utils — utilities like cache