export const VALIDATION_RULES = {
  NAME: {
    MIN: 1,
    MAX: 15
  },
  PASSWORD: {
    MIN: 6,
    MAX: 12
  },
  AVATAR: {
    FILE_EXTENSION: /(.*?)\.(jpg|png)$/
  }
};

export const VALIDATION_MESSAGES = {
  NAME: {
    MIN: `name cannot be less than ${VALIDATION_RULES.NAME.MIN} characters`,
    MAX: `name cannot be more  than ${VALIDATION_RULES.NAME.MAX} characters`,
  },
  PASSWORD: {
    MIN: `password cannot be less than ${VALIDATION_RULES.PASSWORD.MIN}`,
    MAX: `password cannot be more  than ${VALIDATION_RULES.PASSWORD.MAX}`,
  },

  AVATAR: {
    FILE_EXTENSION: 'not correct extension. only jpg or png'
  }
};
