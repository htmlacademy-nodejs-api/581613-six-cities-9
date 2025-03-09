export const VALIDATION_RULES = {
  TEXT: {
    MIN: 5,
    MAX: 100
  },
  RATING: {
    MIN: 1,
    MAX: 5
  }
};

export const VALIDATION_MESSAGES = {
  TEXT: {
    MIN: `text cannot be less than ${VALIDATION_RULES.TEXT.MIN} characters`,
    MAX: `text cannot be more  than ${VALIDATION_RULES.TEXT.MAX} characters`,
  },
  RATING: {
    MIN: `rating cannot be less than ${VALIDATION_RULES.RATING.MIN}`,
    MAX: `rating cannot be more  than ${VALIDATION_RULES.RATING.MAX}`,
  }
};
