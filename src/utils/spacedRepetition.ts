import { addDays } from './dateUtils';

/**
 * Calculates the next review date using the SM-2 spaced repetition algorithm
 * 
 * @param performanceRating Rating from 1-5 (1=forgot, 5=perfect recall)
 * @param previousInterval Previous interval in days
 * @param easeFactor Current ease factor
 * @returns Object with next review date, new interval and new ease factor
 */
export function calculateNextReviewDate(
  performanceRating: number,
  previousInterval = 1,
  easeFactor = 2.5
): { nextReviewDate: Date; interval: number; easeFactor: number } {
  // Calculate new ease factor (minimum 1.3)
  const newEaseFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - performanceRating) * (0.08 + (5 - performanceRating) * 0.02))
  );
  
  let newInterval;
  
  if (performanceRating < 3) {
    // If rating is less than 3, start over with interval of 1
    newInterval = 1;
  } else if (previousInterval === 1) {
    // First successful review
    newInterval = 2;
  } else if (previousInterval === 2) {
    // Second successful review
    newInterval = 6;
  } else {
    // Calculate new interval based on previous and ease factor
    newInterval = Math.round(previousInterval * newEaseFactor);
  }
  
  // Calculate the next review date
  const nextReviewDate = addDays(new Date(), newInterval);
  
  return {
    nextReviewDate,
    interval: newInterval,
    easeFactor: newEaseFactor
  };
}