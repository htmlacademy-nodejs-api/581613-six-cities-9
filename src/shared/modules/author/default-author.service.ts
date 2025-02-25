import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { AuthorService } from './author-service.interface.js';
import { AuthorEntity } from './author.entity.js';
import { CreateAuthorDto } from './dto/create-author.dto.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

@injectable()
export class DefaultAuthorService implements AuthorService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.AuthorModel) private readonly authorModel: types.ModelType<AuthorEntity>
  ) {}

  public async create(dto: CreateAuthorDto): Promise<DocumentType<AuthorEntity>> {
    const user = new AuthorEntity(dto);

    const result = await this.authorModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<AuthorEntity> | null> {
    return this.authorModel.findOne({email});
  }

  public async findById(id: string): Promise<DocumentType<AuthorEntity> | null> {
    return this.authorModel.findOne({id});
  }

  public async findOrCreate(dto: CreateAuthorDto): Promise<DocumentType<AuthorEntity>> {
    const existedAuthor = await this.findByEmail(dto.email);

    if (existedAuthor) {
      return existedAuthor;
    }

    return this.create(dto);
  }
}
