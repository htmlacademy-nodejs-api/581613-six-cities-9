import { IsArray, IsOptional, IsEnum, Max, MaxLength, Min, MinLength, ArrayMaxSize, IsBoolean } from 'class-validator';

import { FeatureType } from '../../../types/features.enum.js';
import { OfferType } from '../../../types/offer-type.enum.js';
import { VALIDATION_RULES, VALIDATION_MESSAGES } from './offer.validation.js';
import { getDefaultInvalidText } from '../../../helpers/common.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(VALIDATION_RULES.TITLE_LENGTH.MIN, { message: VALIDATION_MESSAGES.TITLE_LENGTH.MIN })
  @MaxLength(VALIDATION_RULES.TITLE_LENGTH.MAX, { message: VALIDATION_MESSAGES.TITLE_LENGTH.MAX })
  public title?: string;

  @IsOptional()
  @MinLength(VALIDATION_RULES.DESCRIPTION_LENGTH.MIN, { message: VALIDATION_MESSAGES.DESCRIPTION_LENGTH.MIN })
  @MaxLength(VALIDATION_RULES.DESCRIPTION_LENGTH.MAX, { message: VALIDATION_MESSAGES.DESCRIPTION_LENGTH.MIN })
  public description?: string;

  @IsOptional()
  @MinLength(VALIDATION_RULES.PREVIEW_IMAGE.LENGTH, { message: VALIDATION_MESSAGES.PREVIEW_IMAGE.LENGTH })
  public previewImage: string;

  @IsOptional()
  @IsArray({ message: VALIDATION_MESSAGES.IMAGES.UNEXPECTED })
  @ArrayMaxSize(VALIDATION_RULES.IMAGES.LENGTH, { message: VALIDATION_MESSAGES.IMAGES.LENGTH })
  public images: string[];

  @IsOptional()
  @IsBoolean({ message: getDefaultInvalidText('premium') })
  public premium: boolean;

  @IsOptional()
  @IsEnum(OfferType)
  public type: OfferType;

  @IsOptional()
  @Min(VALIDATION_RULES.ROOMS_COUNT.MIN, { message: VALIDATION_MESSAGES.ROOMS_COUNT.MIN })
  @Max(VALIDATION_RULES.ROOMS_COUNT.MAX, { message: VALIDATION_MESSAGES.ROOMS_COUNT.MAX })
  public roomsCount: number;

  @IsOptional()
  @Min(VALIDATION_RULES.RATING.MIN, { message: VALIDATION_MESSAGES.GUESTS_COUNT.MIN })
  @Max(VALIDATION_RULES.RATING.MAX, { message: VALIDATION_MESSAGES.GUESTS_COUNT.MAX })
  public guestsCount: number;

  @IsOptional()
  @Min(VALIDATION_RULES.PRICE.MIN, { message: VALIDATION_MESSAGES.PRICE.MIN })
  @Max(VALIDATION_RULES.PRICE.MAX, { message: VALIDATION_MESSAGES.PRICE.MAX })
  public price: number;

  @IsOptional()
  @IsArray()
  @IsEnum(FeatureType, { each: true, message: getDefaultInvalidText('feature') })
  public features: FeatureType[];
}
