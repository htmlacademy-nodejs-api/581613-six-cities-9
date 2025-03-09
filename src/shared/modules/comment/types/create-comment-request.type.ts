import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { CreateCommentDto } from '../dto/create-comment.dto.js';
import { RequestBody } from '../../../libs/rest/index.js';

export type CreateCommentRequest = Request<ParamsDictionary | { offerId: string }, RequestBody, CreateCommentDto>;
