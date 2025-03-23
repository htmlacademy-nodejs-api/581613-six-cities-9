import { Request } from 'express';
import { CreateCommentDto } from '../dto/create-comment.dto.js';
import { RequestBody } from '../../../libs/rest/index.js';
import { ParamsDictionary } from 'express-serve-static-core';

export type CreateCommentRequest = Request<ParamsDictionary | { offerId: string }, RequestBody, CreateCommentDto>;
