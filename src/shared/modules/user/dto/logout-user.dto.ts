import { IsEmail } from 'class-validator';

import { getDefaultInvalidText } from '../../../helpers/common.js';

export class LogoutUserDto {
  @IsEmail({}, { message: getDefaultInvalidText('email') })
  public email: string;
}
