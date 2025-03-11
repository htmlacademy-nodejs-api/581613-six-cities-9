import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

import { Comment } from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';
import { OfferEntity } from '../offer/offer.entity.js';

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  }
})
export class CommentEntity extends defaultClasses.TimeStamps implements Comment {
  constructor(commentData: Comment) {
    super();

    this.offerId = commentData.offerId;
    this.user = commentData.user;
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

  @prop({
    ref: OfferEntity,
    required: true,
    default: {},
    _id: false
  })
  public offerId: string;

  @prop({ required: true, default: '' })
  public text: string;

  @prop({ required: true })
  public rating: number;
}

export const CommentModel = getModelForClass(CommentEntity);
