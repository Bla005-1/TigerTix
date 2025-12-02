# Project Overview
TigerTix is a distributed web application that lets users browse campus events, purchase tickets, interact with a natural-language booking assistant, and securely authenticate using a multi-service backend. The system is designed for clarity, accessibility, reliability, and extensibility.

# Tech Stack
- React (frontend)
- Node.js + Express (backend services)
- SQLite (data storage)
- Google Gemini API (LLM)

# Architecture Summary
TigerTix uses a microservices design. Each backend service has its own routes, controllers, and models but all share a central SQLite database.

Admin Service (5001)
- Creates/updates events
- Validates input and writes to the shared database

Client Service (6001)
- Returns all events
- Handles ticket purchases with transaction-safe updates

Auth Service (7001)
- Handles registration + login
- Stores hashed passwords using bcryptjs
- Issues JWT tokens with expiration
- Protects sensitive routes

LLM Service (8001)
- Accepts natural-language input
- Extracts intent (event + quantity)
- Proposes a booking but never executes one until the user confirms

Frontend
- Displays events, ticket counts, realtime updates
- Provides login/register pages
- Provides a chat/voice interface for LLM booking
- Fully keyboard-accessible with ARIA markup

# Installation & Setup Instructions
1) Prerequisites: Node.js 18+, npm, git.
2) Clone repo and `cd` into the project root.
3) Install dependencies: `npm install` in frontend and backend folders.
4) Database setup: run init.sql in your sqlite database or use the initDB function in setup.js.

# Environment Variables Setup
Use `cp .env.template .env` and edit the .env file with the correct values.

# How to Run Regression Tests
1) Unit/integration tests: 
    - Backend: `cd backend` then `npm test`
    - Frontend: `cd frontend` then `npm test`
2) E2E: `npx playwright test`, must be running microservices

# Team Members, Instructor and TAs
- Instructor: Dr. Julian Brinkley
- TAs:  Colt Doster and Atik Enam
- Team Members: Jack Nelson and Bryce Dickson.

# License
MIT License

Copyright (c) 2025 Jack Nelson and Bryce Dickson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
