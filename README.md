# AI StudyBuddy API

AI-powered learning assistance backend built with **Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Multer and Google Gemini**.

## Features

- JWT authentication and bcrypt password hashing
- Student/Admin role-based access control
- Study material upload and management
- AI-generated summaries
- AI-generated flashcards
- AI-generated MCQ quizzes
- Personalized AI study plans
- MongoDB persistence
- RESTful API architecture
- Postman-ready endpoints

## Project structure

```text
AI-StudyBuddy/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
├── uploads/
├── .env.example
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## Requirements

- Node.js 16+
- npm 8+
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key
- VS Code recommended
- Postman for API testing

## Setup

1. Open this folder in VS Code.
2. Install packages:

```bash
npm install
```

3. Create `.env` from `.env.example` and fill in:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:3000
```

4. Start the server:

```bash
npm run dev
```

or:

```bash
npm start
```

The API runs at `http://localhost:5000`.

## API endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Study material

- `POST /api/material/upload`
- `GET /api/material`
- `GET /api/material/:id`
- `PUT /api/material/:id`
- `DELETE /api/material/:id`

### AI features

- `POST /api/materials/:id/summarize`
- `POST /api/ai/flashcards`
- `POST /api/ai/quiz`
- `POST /api/ai/study-plan`

### Admin

- `GET /api/admin/users`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/stats`

Protected endpoints require:

```text
Authorization: Bearer <JWT_TOKEN>
```

## Notes

For an uploaded PDF or document to be used by the AI generation endpoints, the current MVP expects its text to also be supplied in the `content` form field. File storage is handled by Multer. A future enhancement can add PDF text extraction.

## Security

Never commit `.env` or API keys to GitHub. `.env` is already included in `.gitignore`.
