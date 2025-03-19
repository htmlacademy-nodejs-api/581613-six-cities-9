import { IsEmail, MaxLength, MinLength } from 'class-validator';

import { VALIDATION_MESSAGES, VALIDATION_RULES } from './user.validation.js';
import { getDefaultInvalidText } from '../../../helpers/common.js';

export class LoginUserDto {
  @IsEmail({}, { message: getDefaultInvalidText('email') })
  public email: string;

  @MinLength(VALIDATION_RULES.PASSWORD.MIN,{ message: VALIDATION_MESSAGES.PASSWORD.MIN })
  @MaxLength(VALIDATION_RULES.PASSWORD.MAX,{ message: VALIDATION_MESSAGES.PASSWORD.MAX })
  public password: string;
}
