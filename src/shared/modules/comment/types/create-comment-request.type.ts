import { Request } from 'express';
import { CreateCommentDto } from '../dto/create-comment.dto.js';
import { RequestBody, RequestParams } from '../../../libs/rest/index.js';

export type CreateCommentRequest = Request<RequestParams, RequestBody, CreateCommentDto>;
