# AI Vocabulary Coach - Frontend

React frontend for the AI Vocabulary Coach application.

## 🚀 Getting Started

### Installation

```bash
cd client
npm install
```

### Development

```bash
npm run dev
```

The app will run on `http://localhost:3000`

### Build

```bash
npm run build
```

## 🎨 Features

- **Authentication**: Login and signup pages
- **Dashboard**: Overview of learning progress and statistics
- **Add Word**: AI-powered word addition with definitions, examples, and exercises
- **Review System**: Spaced repetition review with AI-generated quizzes
- **Sentence Practice**: Get AI feedback on your sentences
- **Progress Tracking**: Visual progress bars and statistics

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation component
│   │   └── ProtectedRoute.jsx   # Route protection
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication context
│   ├── pages/
│   │   ├── Login.jsx            # Login page
│   │   ├── Signup.jsx           # Signup page
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   ├── AddWord.jsx          # Add new word
│   │   └── Review.jsx           # Review interface
│   ├── services/
│   │   └── api.js               # API service layer
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Tailwind styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🛠️ Technologies

- **React 18**: UI framework
- **Vite**: Build tool
- **React Router**: Navigation
- **Axios**: HTTP client
- **Tailwind CSS**: Styling

## 🎯 Pages

### Login / Signup

- JWT-based authentication
- Form validation
- Error handling

### Dashboard

- Total words, due today, mastered, learning stats
- Progress visualization
- Today's review list
- Recently added words

### Add Word

- Simple word input
- AI generates:
  - Definition
  - 3 example sentences
  - 3 collocations
  - Practice exercise
- Real-time feedback

### Review

- Progress bar
- Word details with examples
- AI-generated quiz (fill-in-blank + multiple choice)
- Sentence practice with AI feedback
- Grade buttons: Again, Hard, Good, Easy
- SM-2 algorithm integration

## 🔧 Configuration

The Vite config proxies `/api` requests to `http://localhost:5000` for development.

## 📝 Usage

1. **Sign up** or **Login**
2. **Add words** - Enter any English word
3. **Review** - Study words due today with AI quizzes
4. **Track progress** - View statistics and mastery level

## 🎨 Styling

Uses Tailwind CSS with custom utilities:

- `.btn` - Button base
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary button
- `.input` - Form input
- `.card` - Content card

## 📄 License

MIT
