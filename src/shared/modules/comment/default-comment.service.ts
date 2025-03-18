import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { CommentService } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

const DEFAULT_COMMENTS_COUNT = 50;

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) { }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);

    this.logger.info(`New comment created at: ${comment.createdAt}`);

    return comment;
  }

  public async findByOfferId(offerId: string, limit = DEFAULT_COMMENTS_COUNT): Promise<DocumentType<CommentEntity>[] | null> {
    return this.commentModel.find({ offerId }).sort({ commentCount: SortType.Down })
      .limit(limit);
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({ offerId })
      .exec();

    return result.deletedCount;
  }
}
