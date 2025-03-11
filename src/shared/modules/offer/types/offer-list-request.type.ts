import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

export type OfferRequestParams = Request<ParamsDictionary | { offerId: string }>;
