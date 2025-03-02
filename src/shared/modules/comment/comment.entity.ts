import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

import { Comment } from '../../types/index.js';
import { AuthorEntity } from '../author/author.entity.js';

@modelOptions({
  schemaOptions: {
    collection: 'authors',
    timestamps: true,
  }
})
export class CommentEntity extends defaultClasses.TimeStamps implements Comment {
  constructor(commentData: Comment) {
    super();

    this.author = commentData.author;
    this.date = commentData.date;
    this.text = commentData.text;
    this.rating = commentData.rating;
  }

  @prop({
    ref: AuthorEntity,
    required: true,
    default: {},
    _id: false
  })
  public author: string;

  @prop({ required: true })
  public date: Date;

  @prop({ required: true, default: '' })
  public text: string;

  @prop({ required: true })
  public rating: number;
}

export const CommentModel = getModelForClass(CommentEntity);
