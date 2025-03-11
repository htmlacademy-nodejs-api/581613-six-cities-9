import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

export type CommentsRequestParams = Request<ParamsDictionary | { offerId: string }, unknown, unknown, { count?: string }>;
