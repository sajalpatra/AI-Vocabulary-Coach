# AI Vocabulary Coach - Backend

Backend server for the AI Vocabulary Coach application - a personal vocabulary learning app with AI-powered features and spaced repetition.

## 🎯 Features

- **JWT Authentication**: Secure user signup and login
- **AI-Powered Learning**: OpenAI integration for definitions, examples, and quizzes
- **Spaced Repetition**: SM-2 algorithm for optimal review scheduling
- **Daily Reviews**: Get words due for review each day
- **Quiz Generation**: AI-generated fill-in-the-blank and multiple-choice questions
- **Sentence Feedback**: AI correction and explanation for user sentences

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure environment variables**:

   - Copy `.env.example` to `.env`
   - Update the values:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     OPENAI_API_KEY=your_openai_api_key
     PORT=5000
     ```

3. **Start the server**:

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication

| Method | Endpoint           | Description       | Auth Required |
| ------ | ------------------ | ----------------- | ------------- |
| POST   | `/api/auth/signup` | Register new user | No            |
| POST   | `/api/auth/login`  | Login user        | No            |
| GET    | `/api/auth/me`     | Get current user  | Yes           |

### Words

| Method | Endpoint              | Description                | Auth Required |
| ------ | --------------------- | -------------------------- | ------------- |
| POST   | `/api/words/add`      | Add new word (AI-enhanced) | Yes           |
| GET    | `/api/words/my-words` | Get all user's words       | Yes           |
| GET    | `/api/words/:id`      | Get single word            | Yes           |
| DELETE | `/api/words/:id`      | Delete word                | Yes           |

### Review

| Method | Endpoint             | Description              | Auth Required |
| ------ | -------------------- | ------------------------ | ------------- |
| GET    | `/api/review/today`  | Get words due today      | Yes           |
| POST   | `/api/review/submit` | Submit review with grade | Yes           |
| GET    | `/api/review/stats`  | Get review statistics    | Yes           |

### AI

| Method | Endpoint           | Description             | Auth Required |
| ------ | ------------------ | ----------------------- | ------------- |
| POST   | `/api/ai/quiz`     | Generate quiz for word  | Yes           |
| POST   | `/api/ai/feedback` | Get sentence correction | Yes           |

## 📝 API Usage Examples

### Sign Up

```bash
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Add Word

```bash
POST /api/words/add
Headers: { "Authorization": "Bearer <token>" }
{
  "text": "approach"
}
```

_AI automatically generates definition, examples, collocations, and exercise_

### Submit Review

```bash
POST /api/review/submit
Headers: { "Authorization": "Bearer <token>" }
{
  "userWordId": "64f5a2b3c1d2e3f4a5b6c7d8",
  "grade": "good"  // or 0-5, or: again, hard, good, easy
}
```

### Generate Quiz

```bash
POST /api/ai/quiz
Headers: { "Authorization": "Bearer <token>" }
{
  "word": "approach",
  "difficulty": "B1"
}
```

### Get Sentence Feedback

```bash
POST /api/ai/feedback
Headers: { "Authorization": "Bearer <token>" }
{
  "sentence": "I will approach to the problem carefully",
  "word": "approach"
}
```

## 🧠 SM-2 Algorithm

The spaced repetition system uses the SM-2 algorithm with the following grades:

- **0 (again)**: Complete blackout - restart learning
- **2 (hard)**: Difficult recall
- **3 (good)**: Correct with hesitation
- **5 (easy)**: Perfect recall

### Algorithm Logic:

- Grade < 2: Reset interval to 1 day
- Grade ≥ 2: Increase interval based on repetitions
  - 1st repetition: 1 day
  - 2nd repetition: 3 days
  - 3rd+ repetition: previous interval × efactor
- EFactor updates based on performance (min: 1.3)

## 📂 Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js   # Authentication logic
│   │   ├── word.controller.js   # Word management
│   │   ├── review.controller.js # Review system
│   │   └── ai.controller.js     # AI features
│   ├── middleware/
│   │   └── auth.middleware.js   # JWT verification
│   ├── models/
│   │   ├── User.model.js        # User schema
│   │   ├── Word.model.js        # Word schema
│   │   └── UserWord.model.js    # User's word data + SM-2 fields
│   ├── routes/
│   │   ├── auth.routes.js       # Auth endpoints
│   │   ├── word.routes.js       # Word endpoints
│   │   ├── review.routes.js     # Review endpoints
│   │   └── ai.routes.js         # AI endpoints
│   ├── utils/
│   │   ├── sm2.js              # SM-2 algorithm
│   │   ├── jwt.js              # JWT utilities
│   │   └── openai.js           # OpenAI integration
│   └── index.js                # Server entry point
├── .env.example
├── .gitignore
└── package.json
```

## 🔒 Environment Variables

| Variable         | Description                | Example                           |
| ---------------- | -------------------------- | --------------------------------- |
| `MONGO_URI`      | MongoDB connection string  | `mongodb://localhost:27017/vocab` |
| `JWT_SECRET`     | Secret key for JWT signing | `your_secret_key`                 |
| `JWT_EXPIRE`     | JWT expiration time        | `7d`                              |
| `OPENAI_API_KEY` | OpenAI API key             | `sk-...`                          |
| `PORT`           | Server port                | `5000`                            |
| `NODE_ENV`       | Environment mode           | `development` or `production`     |

## 🛠️ Technologies

- **Express.js**: Web framework
- **MongoDB + Mongoose**: Database
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **OpenAI API**: AI-powered features
- **CORS**: Cross-origin resource sharing

## 📊 Database Models

### User

- name, email, password
- Timestamps

### Word

- text, definition, examples, collocations
- difficulty level (A1-C2)

### UserWord

- User reference, Word reference
- AI-generated content (definition, examples, collocations, exercise)
- SM-2 fields: efactor, interval, repetitions, nextReviewAt, lastResult
- Review history

## 🧪 Testing the API

Use tools like Postman, Insomnia, or curl to test the endpoints. Remember to:

1. Sign up or login to get a JWT token
2. Include the token in the Authorization header: `Bearer <token>`
3. All endpoints except `/auth/signup` and `/auth/login` require authentication

## 📄 License

MIT

---

**Next Steps**: Set up the frontend React application to consume this API.
