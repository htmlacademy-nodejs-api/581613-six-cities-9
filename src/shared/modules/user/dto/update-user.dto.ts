import { IsOptional, Matches, MinLength } from 'class-validator';
import { VALIDATION_RULES, VALIDATION_MESSAGES} from './user.validation.js';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(VALIDATION_RULES.NAME.MIN, { message: VALIDATION_MESSAGES.NAME.MIN })
  @MinLength(VALIDATION_RULES.NAME.MAX, { message: VALIDATION_MESSAGES.NAME.MAX })
  public name?: string;

  @IsOptional()
  @Matches(VALIDATION_RULES.AVATAR.FILE_EXTENSION, { message: VALIDATION_MESSAGES.PASSWORD.MIN })
  public avatar?: string;
}
