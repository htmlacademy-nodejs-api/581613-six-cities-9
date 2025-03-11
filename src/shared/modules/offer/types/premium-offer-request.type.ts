import { Request } from 'express';
import { City } from '../../../types/cities.enum.js';

export type PremiumOfferRequest = Request<unknown, unknown, unknown, { city?: City }>;
