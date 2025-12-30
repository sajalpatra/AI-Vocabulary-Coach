import OpenAI from "openai";

// Lazy initialization of OpenAI client
let openai = null;

const getOpenAIClient = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

/**
 * Generate word information using OpenAI
 */
export const generateWordInfo = async (word) => {
  try {
    const openai = getOpenAIClient();
    const prompt = `For the English word "${word}", provide:
1. A simple, clear definition
2. Three example sentences using the word in different contexts
3. Three common collocations (word combinations)
4. One fill-in-the-blank exercise

Format the response as JSON:
{
  "definition": "...",
  "examples": ["...", "...", "..."],
  "collocations": ["...", "...", "..."],
  "exercise": "..."
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful English vocabulary teacher. Provide accurate, educational content in valid JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate word information");
  }
};

/**
 * Generate quiz for a word
 */
export const generateQuiz = async (word, difficulty = "B1") => {
  try {
    const openai = getOpenAIClient();
    const prompt = `Create a quiz for the word "${word}" at ${difficulty} level.
Generate:
1. One fill-in-the-blank question with the correct answer
2. One multiple-choice question with 4 options (mark the correct one)

Format as JSON:
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a vocabulary quiz generator. Create engaging, educational questions in valid JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate quiz");
  }
};

/**
 * Provide feedback on user's sentence
 */
export const provideFeedback = async (sentence, word) => {
  try {
    const openai = getOpenAIClient();
    const prompt = `Check this sentence for correctness: "${sentence}"
The sentence should use the word "${word}".

Provide:
1. A corrected version (if needed, otherwise same as original)
2. A short explanation of any corrections made

Format as JSON:
{
  "correctedSentence": "...",
  "explanation": "..."
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an English grammar checker. Provide helpful, constructive feedback in valid JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to provide feedback");
  }
};

export default getOpenAIClient;
