/**
 * SM-2 Spaced Repetition Algorithm
 *
 * @param {Object} userWord - The UserWord document
 * @param {Number} grade - Grade from 0-5 (0=complete blackout, 5=perfect recall)
 * @returns {Object} - Updated fields for the userWord
 */
export const calculateNextReview = (userWord, grade) => {
  let { efactor, interval, repetitions } = userWord;

  // If grade < 2, reset the learning process
  if (grade < 2) {
    interval = 1;
    repetitions = 0;
  } else {
    // Increment repetitions
    repetitions += 1;

    // Calculate interval based on repetition number
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 3;
    } else {
      interval = Math.round(interval * efactor);
    }
  }

  // Update efactor based on grade
  // Formula: EF' = EF + (0.1 - (3 - grade) * (0.08 + (3 - grade) * 0.02))
  efactor = efactor + (0.1 - (3 - grade) * (0.08 + (3 - grade) * 0.02));

  // Minimum efactor is 1.3
  if (efactor < 1.3) {
    efactor = 1.3;
  }

  // Calculate next review date
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return {
    efactor: parseFloat(efactor.toFixed(2)),
    interval,
    repetitions,
    nextReviewAt,
    lastResult: grade,
  };
};

/**
 * Get difficulty mapping for grade buttons
 */
export const getDifficultyGrades = () => {
  return {
    again: 0, // Complete blackout
    hard: 2, // Difficult recall
    good: 3, // Correct response with hesitation
    easy: 5, // Perfect response
  };
};

/**
 * Check if a word is due for review
 */
export const isDueForReview = (userWord) => {
  const now = new Date();
  return new Date(userWord.nextReviewAt) <= now;
};

/**
 * Get words due today for a user
 */
export const getWordsForToday = (userWords) => {
  const now = new Date();
  return userWords.filter((word) => new Date(word.nextReviewAt) <= now);
};
