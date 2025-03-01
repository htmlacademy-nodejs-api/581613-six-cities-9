import { City } from '../../../types/cities.enum.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { FeatureType } from '../../../types/features.enum.js';
import { OfferType } from '../../../types/offer-type.enum.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public postDate: Date;
  public city: City;
  public previewImage: string;
  public images: string[];
  public premium: boolean;
  public rating: number;
  public type: OfferType;
  public roomsCount: number;
  public guestsCount: number;
  public price: number;
  public features: FeatureType[];
  public author: string;
  public coordinates: Coordinates;
  public commentsCount?: number;
}
