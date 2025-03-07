import { Request } from 'express';

import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { LogoutUserDto } from '../dto/logout-user.dto.js';

export type LogoutUserRequest = Request<RequestParams, RequestBody, LogoutUserDto>;
