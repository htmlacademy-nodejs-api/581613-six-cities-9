export const VALIDATION_RULES = {
  TITLE_LENGTH: {
    MIN: 10,
    MAX: 100
  },
  DESCRIPTION_LENGTH: {
    MIN: 20,
    MAX: 1024
  },
  PREVIEW_IMAGE: {
    LENGTH: 3
  },
  IMAGES: {
    LENGTH: 6
  },
  RATING: {
    MIN: 1,
    MAX: 5,
    MAX_DECIMAL_DIGITS: 1
  },
  ROOMS_COUNT: {
    MIN: 1,
    MAX: 8,
  },
  GUESTS_COUNT: {
    MIN: 1,
    MAX: 10,
  },
  PRICE: {
    MIN: 100,
    MAX: 100000,
  }
};

export const VALIDATION_MESSAGES = {
  TITLE_LENGTH: {
    MIN: `title cannot be less than ${VALIDATION_RULES.TITLE_LENGTH.MIN} characters`,
    MAX: `title cannot be more  than ${VALIDATION_RULES.TITLE_LENGTH.MAX} characters`,
  },
  DESCRIPTION_LENGTH: {
    MIN: `description cannot be less than ${VALIDATION_RULES.DESCRIPTION_LENGTH.MIN} characters`,
    MAX: `description cannot be more  than ${VALIDATION_RULES.DESCRIPTION_LENGTH.MAX} characters`,
  },
  CITY: {
    NOT_AVAILABLE: 'service is not available in this city'
  },
  PREVIEW_IMAGE: {
    LENGTH: 'image link is incorrect'
  },
  IMAGES: {
    UNEXPECTED: 'expected array of links to photos',
    LENGTH: `no more than ${VALIDATION_RULES.IMAGES.LENGTH} photos`,
    INVALID: 'image link is incorrect'
  },
  RATING: {
    MIN: `rating cannot be less than ${VALIDATION_RULES.RATING.MIN}`,
    MAX: `rating cannot be more  than ${VALIDATION_RULES.RATING.MAX}`,
  },
  ROOMS_COUNT: {
    MIN: `rooms count cannot be less than ${VALIDATION_RULES.ROOMS_COUNT.MIN}`,
    MAX: `rooms count cannot be more  than ${VALIDATION_RULES.ROOMS_COUNT.MAX}`,
  },
  GUESTS_COUNT: {
    MIN: `guests count cannot be less than ${VALIDATION_RULES.GUESTS_COUNT.MIN}`,
    MAX: `guests count cannot be more  than ${VALIDATION_RULES.GUESTS_COUNT.MAX}`,
  },
  PRICE: {
    MIN: `price cannot be less than ${VALIDATION_RULES.GUESTS_COUNT.MIN}`,
    MAX: `price count cannot be more  than ${VALIDATION_RULES.GUESTS_COUNT.MAX}`,
  }
};
