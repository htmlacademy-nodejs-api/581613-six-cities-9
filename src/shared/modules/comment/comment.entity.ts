import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

import { Comment } from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
export class CommentEntity extends defaultClasses.TimeStamps implements Comment {
  constructor(commentData: Comment) {
    super();

    this.user = commentData.user;
    this.date = commentData.date;
    this.text = commentData.text;
    this.rating = commentData.rating;
  }

  @prop({
    ref: UserEntity,
    required: true,
    default: {},
    _id: false
  })
  public user: string;

  @prop({ required: true })
  public date: Date;

  @prop({ required: true, default: '' })
  public text: string;

  @prop({ required: true })
  public rating: number;
}

export const CommentModel = getModelForClass(CommentEntity);
