import { Request } from 'express';

export type OfferRequestParams = Request<{ offerId: string }>;
