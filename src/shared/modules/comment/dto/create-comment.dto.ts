import { Min, Max, MinLength, MaxLength } from 'class-validator';

import { VALIDATION_MESSAGES, VALIDATION_RULES } from './comment.validation.js';

export class CreateCommentDto {
  public offerId: string;

  @MinLength(VALIDATION_RULES.TEXT.MIN, { message: VALIDATION_MESSAGES.TEXT.MIN })
  @MaxLength(VALIDATION_RULES.TEXT.MAX, { message: VALIDATION_MESSAGES.TEXT.MAX })
  public text: string;

  @Min(VALIDATION_RULES.RATING.MIN, { message: VALIDATION_MESSAGES.RATING.MIN })
  @Max(VALIDATION_RULES.RATING.MAX, { message: VALIDATION_MESSAGES.RATING.MAX })
  public rating: number;

  public user: string;
}
