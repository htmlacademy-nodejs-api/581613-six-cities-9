import { Request } from 'express';

export type FavouritesOfferRequest = Request<unknown, unknown, unknown, { userId?: string }>;
