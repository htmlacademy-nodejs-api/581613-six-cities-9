import { IsEmail, Length, IsBoolean, IsOptional, Matches } from 'class-validator';

import { VALIDATION_MESSAGES, VALIDATION_RULES } from './user.validation.js';
import { getDefaultInvalidText } from '../../../helpers/common.js';

export class CreateUserDto {
  @Length(VALIDATION_RULES.NAME.MIN, VALIDATION_RULES.NAME.MAX,{ message: VALIDATION_MESSAGES.NAME.MIN })
  public name: string;

  @IsEmail({}, { message: getDefaultInvalidText('email') })
  public email: string;

  @Length(VALIDATION_RULES.NAME.MIN, VALIDATION_RULES.NAME.MAX,{ message: VALIDATION_MESSAGES.PASSWORD.MIN })
  public password: string;

  @IsBoolean({ message: getDefaultInvalidText('isPro') })
  public isPro: boolean;

  @IsOptional()
  @Matches(VALIDATION_RULES.AVATAR.FILE_EXTENSION, { message: VALIDATION_MESSAGES.PASSWORD.MIN })
  public avatar?: string;
}
