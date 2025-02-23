import { City } from './cities.enum.js';
import { FeatureType } from './features.enum.js';
import { OfferType } from './offer-type.enum.js';

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  images: string[];
  cities: City[];
  offerTypes: OfferType[];
  features: FeatureType[];
  authors: string[];
};
