import { DocumentType } from '@typegoose/typegoose';

import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

export interface CommentService {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string, count?: number): Promise<DocumentType<CommentEntity>[] | null>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
