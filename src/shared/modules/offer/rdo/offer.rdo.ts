import { Expose, Type } from 'class-transformer';
import { City } from '../../../types/cities.enum.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { OfferType } from '../../../types/offer-type.enum.js';
import { FeatureType } from '../../../types/features.enum.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose({ name: 'createdAt'})
  public postDate: string;

  @Expose()
  public city: City;

  @Expose()
  public previewImage: string;

  @Expose()
  public images: string[];

  @Expose()
  public premium: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: OfferType;

  @Expose()
  public roomsCount: number;

  @Expose()
  public guestsCount: number;

  @Expose()
  public price: number;

  @Expose()
  public features: FeatureType[];

  @Expose()
  @Type(() => UserRdo)
  public user: UserRdo;

  @Expose()
  public coordinates: Coordinates;

  @Expose()
  public commentsCount?: number;
}
