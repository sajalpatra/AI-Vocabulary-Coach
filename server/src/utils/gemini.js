import OpenAI from "openai";

// Lazy initialization of OpenRouter client
let openai = null;

// Available free models (fallback chain)
const FREE_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "google/gemini-flash-1.5:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
];

const getOpenRouterClient = () => {
  if (!openai) {
    openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:5000",
        "X-Title": process.env.SITE_NAME || "AI Vocabulary Coach",
      },
    });
  }
  return openai;
};

/**
 * Make API call with fallback models
 */
const makeAIRequest = async (messages, retryCount = 0) => {
  const openai = getOpenRouterClient();
  const modelIndex = Math.min(retryCount, FREE_MODELS.length - 1);
  const model = FREE_MODELS[modelIndex];

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    // If rate limited and we have more models to try
    if (error.status === 429 && retryCount < FREE_MODELS.length - 1) {
      console.log(`Rate limited on ${model}, trying next model...`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s
      return makeAIRequest(messages, retryCount + 1);
    }
    throw error;
  }
};

/**
 * Generate word information using Gemini via OpenRouter
 */
export const generateWordInfo = async (word) => {
  try {
    const prompt = `For the English word "${word}", provide:
1. A simple, clear definition
2. Three example sentences using the word in different contexts
3. Three common collocations (word combinations)
4. One fill-in-the-blank exercise

Format the response as JSON only, no markdown or code blocks:
{
  "definition": "...",
  "examples": ["...", "...", "..."],
  "collocations": ["...", "...", "..."],
  "exercise": "..."
}`;

    const responseText = await makeAIRequest([
      {
        role: "user",
        content: prompt,
      },
    ]);

    // Clean the response - remove markdown code blocks if present
    const cleanedText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw new Error("Failed to generate word information");
  }
};

/**
 * Generate quiz for a word
 */
export const generateQuiz = async (word, difficulty = "B1") => {
  try {
    const prompt = `Create a quiz for the word "${word}" at ${difficulty} level.
Generate:
1. One fill-in-the-blank question with the correct answer
2. One multiple-choice question with 4 options (mark the correct one)

Format as JSON only, no markdown or code blocks:
{
  "fillInBlank": {
    "question": "The company decided to _____ a new marketing strategy.",
    "answer": "approach"
  },
  "multipleChoice": {
    "question": "What does 'approach' mean in this context?",
    "options": ["option1", "option2", "option3", "option4"],
    "correctIndex": 1
  }
}`;

    const responseText = await makeAIRequest([
      {
        role: "user",
        content: prompt,
      },
    ]);

    // Clean the response - remove markdown code blocks if present
    const cleanedText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw new Error("Failed to generate quiz");
  }
};

/**
 * Provide feedback on user's sentence
 */
export const provideFeedback = async (sentence, word) => {
  try {
    const prompt = `Check this sentence for correctness: "${sentence}"
The sentence should use the word "${word}".

Provide:
1. A corrected version (if needed, otherwise same as original)
2. A short explanation of any corrections made

Format as JSON only, no markdown or code blocks:
{
  "correctedSentence": "...",
  "explanation": "..."
}`;

    const responseText = await makeAIRequest([
      {
        role: "user",
        content: prompt,
      },
    ]);

    // Clean the response - remove markdown code blocks if present
    const cleanedText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw new Error("Failed to provide feedback");
  }
};

/**
 * AI Chat Assistant - Answer questions about vocabulary and learning
 */
export const chatWithAI = async (question, conversationHistory = []) => {
  try {
    // Build messages array
    const messages = [
      {
        role: "system",
        content: `You are an expert English vocabulary tutor and language learning assistant. Help users with:
- Word meanings, usage, and etymology
- Grammar and sentence structure
- Vocabulary learning tips and techniques
- Pronunciation guidance
- Cultural context of words and phrases

Provide helpful, concise responses (max 200 words).`,
      },
    ];

    // Add conversation history if provided
    if (conversationHistory.length > 0) {
      conversationHistory.forEach((msg) => {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }

    // Add current question
    messages.push({
      role: "user",
      content: question,
    });

    const responseText = await makeAIRequest(messages);

    return {
      answer: responseText.trim(),
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw new Error("Failed to get AI response");
  }
};

/**
 * Get word suggestions based on user's learning level and interests
 */
export const getWordSuggestions = async (
  userLevel = "B1",
  topic = "general"
) => {
  try {
    const prompt = `Suggest 5 useful English vocabulary words for a ${userLevel} level learner interested in ${topic}.
For each word, provide:
1. The word
2. A brief definition (one sentence)
3. Why it's useful for this learner

Format as JSON only, no markdown or code blocks:
{
  "suggestions": [
    {
      "word": "...",
      "definition": "...",
      "reason": "..."
    }
  ]
}`;

    const responseText = await makeAIRequest([
      {
        role: "user",
        content: prompt,
      },
    ]);

    const cleanedText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw new Error("Failed to generate word suggestions");
  }
};

export default getOpenRouterClient;
