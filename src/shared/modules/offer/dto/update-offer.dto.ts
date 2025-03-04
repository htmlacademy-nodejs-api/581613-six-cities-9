import { FeatureType } from '../../../types/features.enum.js';
import { OfferType } from '../../../types/offer-type.enum.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public previewImage?: string;
  public images?: string[];
  public premium?: boolean;
  public type?: OfferType;
  public roomsCount?: number;
  public guestsCount?: number;
  public price?: number;
  public features?: FeatureType[];
}
