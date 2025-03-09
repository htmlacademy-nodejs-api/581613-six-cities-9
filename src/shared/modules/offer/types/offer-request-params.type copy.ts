import { Request } from 'express';

export type OffersListRequestParams = Request<unknown, unknown, unknown, { count?: string }>;
