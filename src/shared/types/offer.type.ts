import { City } from './cities.enum.js';
import { Coordinates } from './coordinates.type.js';
import { FeatureType } from './features.enum.js';
import { OfferType } from './offer-type.enum.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  city: City;
  previewImage: string;
  images: string[];
  premium: boolean;
  rating: number;
  type: OfferType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  features: FeatureType[];
  user: User;
  coordinates: Coordinates
  commentsCount?: number;
  postDate?: Date;
}
