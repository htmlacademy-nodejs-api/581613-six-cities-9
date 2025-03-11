import { IsMongoId, Min, Max, Length } from 'class-validator';

import { getDefaultInvalidText } from '../../../helpers/common.js';
import { VALIDATION_MESSAGES, VALIDATION_RULES } from './comment.validation.js';

export class CreateCommentDto {
  @IsMongoId({ message: getDefaultInvalidText('offerId') })
  public offerId: string;

  @Length(VALIDATION_RULES.TEXT.MIN, VALIDATION_RULES.TEXT.MAX, { message: VALIDATION_MESSAGES.TEXT.MIN })
  public text: string;

  @Min(VALIDATION_RULES.RATING.MIN, { message: VALIDATION_MESSAGES.RATING.MIN })
  @Max(VALIDATION_RULES.RATING.MAX, { message: VALIDATION_MESSAGES.RATING.MAX })
  public rating: number;

  @IsMongoId({ message: getDefaultInvalidText('user') })
  public user: string;
}
