import { IsMongoId, MaxLength, MinLength } from 'class-validator';

import { getDefaultInvalidText } from '../../../helpers/common.js';
import { VALIDATION_MESSAGES, VALIDATION_RULES } from './comment.validation.js';

export class CreateCommentDto {
  @IsMongoId({ message: getDefaultInvalidText('offerId') })
  public offerId: string;

  @MinLength(VALIDATION_RULES.TEXT.MIN, { message: VALIDATION_MESSAGES.TEXT.MIN })
  @MaxLength(VALIDATION_RULES.TEXT.MAX, { message: VALIDATION_MESSAGES.TEXT.MAX })
  public text: string;

  @MinLength(VALIDATION_RULES.RATING.MIN, { message: VALIDATION_MESSAGES.RATING.MIN })
  @MaxLength(VALIDATION_RULES.RATING.MAX, { message: VALIDATION_MESSAGES.RATING.MAX })
  public rating: number;

  @IsMongoId({ message: getDefaultInvalidText('user') })
  public user: string;
}
