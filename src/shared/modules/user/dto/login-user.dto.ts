import { IsEmail, Length } from 'class-validator';

import { VALIDATION_MESSAGES, VALIDATION_RULES } from './user.validation.js';
import { getDefaultInvalidText } from '../../../helpers/common.js';

export class LoginUserDto {
  @IsEmail({}, { message: getDefaultInvalidText('email') })
  public email: string;

  @Length(VALIDATION_RULES.NAME.MIN, VALIDATION_RULES.NAME.MAX,{ message: VALIDATION_MESSAGES.PASSWORD.MIN })
  public password: string;
}
