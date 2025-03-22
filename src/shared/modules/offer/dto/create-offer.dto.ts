import { IsArray, ValidateNested, IsString, IsEnum, Max, MinLength, Min, Length, ArrayMaxSize, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

import { City } from '../../../types/cities.enum.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { FeatureType } from '../../../types/features.enum.js';
import { OfferType } from '../../../types/offer-type.enum.js';
import { CoordinatesDto } from './coordinates.dto.js';
import { VALIDATION_MESSAGES, VALIDATION_RULES } from './offer.validation.js';
import { getDefaultInvalidText } from '../../../helpers/common.js';

export class CreateOfferDto {
  @Length(VALIDATION_RULES.TITLE_LENGTH.MIN, VALIDATION_RULES.TITLE_LENGTH.MAX, { message: VALIDATION_MESSAGES.TITLE_LENGTH.MIN })
  public title: string;

  @Length(VALIDATION_RULES.DESCRIPTION_LENGTH.MIN, VALIDATION_RULES.DESCRIPTION_LENGTH.MAX, { message: VALIDATION_MESSAGES.DESCRIPTION_LENGTH.MIN })
  public description: string;

  @IsEnum(City, { message: VALIDATION_MESSAGES.CITY.NOT_AVAILABLE })
  public city: City;

  @MinLength(VALIDATION_RULES.PREVIEW_IMAGE.LENGTH, { message: VALIDATION_MESSAGES.PREVIEW_IMAGE.LENGTH })
  public previewImage: string;

  @IsArray({ message: VALIDATION_MESSAGES.IMAGES.UNEXPECTED })
  @ArrayMaxSize(VALIDATION_RULES.IMAGES.LENGTH, { message: VALIDATION_MESSAGES.IMAGES.LENGTH })
  @IsString({ each: true })
  public images: string[];

  @IsBoolean({ message: getDefaultInvalidText('premium') })
  public premium: boolean;

  @IsEnum(OfferType, { message: getDefaultInvalidText('type') })
  public type: OfferType;

  @Min(VALIDATION_RULES.ROOMS_COUNT.MIN, { message: VALIDATION_MESSAGES.ROOMS_COUNT.MIN })
  @Max(VALIDATION_RULES.ROOMS_COUNT.MAX, { message: VALIDATION_MESSAGES.ROOMS_COUNT.MAX })
  public roomsCount: number;

  @Min(VALIDATION_RULES.RATING.MIN, { message: VALIDATION_MESSAGES.GUESTS_COUNT.MIN })
  @Max(VALIDATION_RULES.RATING.MAX, { message: VALIDATION_MESSAGES.GUESTS_COUNT.MAX })
  public guestsCount: number;

  @Min(VALIDATION_RULES.PRICE.MIN, { message: VALIDATION_MESSAGES.PRICE.MIN })
  @Max(VALIDATION_RULES.PRICE.MAX, { message: VALIDATION_MESSAGES.PRICE.MAX })
  public price: number;

  @IsArray()
  @IsEnum(FeatureType, { each: true, message: getDefaultInvalidText('feature') })
  public features: FeatureType[];

  public user: string;

  @ValidateNested({ message: getDefaultInvalidText('coordinates') })
  @Type(() => CoordinatesDto)
  public coordinates: Coordinates;
}
