import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

import { City, Coordinates, FeatureType, Offer, OfferType } from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
export class OfferEntity extends defaultClasses.TimeStamps implements Offer {
  @prop({ required: true })
  public title: string;

  @prop({ required: true })
  public description: string;

  @prop({
    type: () => String,
    enum: City
  })
  public city: City;

  @prop({ required: true })
  public previewImage: string;

  @prop({ required: true, type: String })
  public images: string[];

  @prop({ required: false, default: false })
  public premium: boolean;

  @prop({ required: false })
  public rating: number;

  @prop({ required: true })
  public roomsCount: number;

  @prop({ required: true })
  public guestsCount: number;

  @prop({
    ref: UserEntity,
    required: true,
    default: {},
    _id: false
  })
  public user: string;

  @prop({ required: true })
  public price: number;

  @prop({
    type: () => String,
    enum: FeatureType,
    required: true
  })
  public features: FeatureType[];

  @prop({
    type: () => String,
    enum: OfferType
  })
  public type: OfferType;

  @prop({ required: true })
  public coordinates: Coordinates;

  @prop({ default: 0 })
  public commentsCount: number;
}

export const OfferModel = getModelForClass(OfferEntity);
