# Migration to Google Gemini AI

## Changes Made

The application has been updated to use **Google Gemini AI** instead of OpenAI.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

This will install the `@google/generative-ai` package.

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

### 3. Update Environment Variables

1. Rename `.env.example` to `.env` (if not already done)
2. Replace the OpenAI API key with your Gemini API key:

```env
# Google Gemini Configuration
GEMINI_API_KEY=your-gemini-api-key-here
```

### 4. Remove OpenAI Package (Optional)

If you want to clean up, you can remove the OpenAI package:

```bash
npm uninstall openai
```

### 5. Delete Old File (Optional)

You can delete the old `server/src/utils/openai.js` file as it's no longer needed.

## What Changed

- **Package**: `openai` → `@google/generative-ai`
- **Model**: `gpt-4o-mini` → `gemini-pro`
- **API Key**: `OPENAI_API_KEY` → `GEMINI_API_KEY`
- **File**: `openai.js` → `gemini.js`

## Features

All features remain the same:

- ✅ Word definitions and examples
- ✅ Quiz generation
- ✅ Sentence feedback
- ✅ Spaced repetition learning

## Benefits of Gemini

- 🆓 Free tier with generous limits
- ⚡ Fast response times
- 🌐 Multilingual support
- 💰 Cost-effective for production use

## Troubleshooting

If you get an error about the API key:

1. Make sure `.env` file exists in the `server` folder
2. Verify your API key is correct
3. Restart the server after updating `.env`

If JSON parsing fails:

- The code automatically removes markdown code blocks from Gemini responses
- If issues persist, check the console logs for the raw response
