import { Request } from 'express';

import { RequestBody, RequestParams } from '../../libs/rest/index.js';
import { FavouriteOfferDto } from './dto/favourite-offer.dto.js';

export type FavouriteOfferRequest = Request<RequestParams, RequestBody, FavouriteOfferDto>;
