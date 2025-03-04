import { Request } from 'express';

import { RequestBody, RequestParams } from '../../libs/rest/index.js';
import { LogoutAuthorDto } from './dto/logout-author.dto.js';

export type LogoutAuthorRequest = Request<RequestParams, RequestBody, LogoutAuthorDto>;
