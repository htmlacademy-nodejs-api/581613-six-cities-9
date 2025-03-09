import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { RequestBody } from '../../../libs/rest/index.js';
import { UpdateOfferDto } from '../dto/update-offer.dto.js';

export type UpdateOfferRequest = Request<{ offerId: string } | ParamsDictionary, RequestBody, UpdateOfferDto>;
