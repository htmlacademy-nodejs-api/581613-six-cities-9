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
  ) { }

  public async create(dto: CreateAuthorDto, salt: string): Promise<DocumentType<AuthorEntity>> {
    const user = new AuthorEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.authorModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<AuthorEntity> | null> {
    return this.authorModel.findOne({ email });
  }

  public async findById(id: string): Promise<DocumentType<AuthorEntity> | null> {
    return this.authorModel.findOne({ id });
  }

  public async findByEmailOrCreate(dto: CreateAuthorDto, salt: string): Promise<DocumentType<AuthorEntity>> {
    const author = await this.findByEmail(dto.email);

    return author ?? this.create(dto, salt);
  }

  public async addFavouriteOffer(userId: string, offerId: string): Promise<DocumentType<AuthorEntity> | null> {
    return this.authorModel.findByIdAndUpdate(userId, {
      '$push': {
        favourites: offerId,
      },
    });
  }

  public async deleteFavouriteOffer(userId: string, offerId: string): Promise<DocumentType<AuthorEntity> | null> {
    return this.authorModel.findByIdAndUpdate(userId, {
      '$pull': {
        favourites: offerId,
      },
    });
  }
}
