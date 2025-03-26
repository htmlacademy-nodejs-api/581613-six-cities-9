import { IsEmail, MinLength, MaxLength, IsBoolean } from 'class-validator';

import { VALIDATION_MESSAGES, VALIDATION_RULES } from './user.validation.js';
import { getDefaultInvalidText } from '../../../helpers/common.js';

export class CreateUserDto {
  @MinLength(VALIDATION_RULES.NAME.MIN, { message: VALIDATION_MESSAGES.NAME.MIN })
  @MaxLength(VALIDATION_RULES.NAME.MAX, { message: VALIDATION_MESSAGES.NAME.MAX })
  public name: string;

  @IsEmail({}, { message: getDefaultInvalidText('email') })
  public email: string;

  @MinLength(VALIDATION_RULES.PASSWORD.MIN, { message: VALIDATION_MESSAGES.PASSWORD.MIN })
  @MaxLength(VALIDATION_RULES.PASSWORD.MAX, { message: VALIDATION_MESSAGES.PASSWORD.MAX })
  public password: string;

  @IsBoolean({ message: getDefaultInvalidText('isPro') })
  public isPro: boolean;
}
