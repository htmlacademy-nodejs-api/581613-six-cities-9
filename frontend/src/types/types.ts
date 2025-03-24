import { CITIES, Sorting, TYPES } from '../const';

export type CityName = typeof CITIES[number];
export type Type = typeof TYPES[number];
export type SortName = keyof typeof Sorting;

export type Location = {
  latitude: number;
  longitude: number;
};

export type User = {
  name: string;
  avatarUrl: string;
  isPro: boolean;
  email: string;
};

export type Comment = {
  id: string;
  text: string;
  date: string;
  rating: number;
  user: User;
};

export type Offer = {
  id: string;
  price: number;
  rating: number;
  title: string;
  premium: boolean;
  isFavorite: boolean;
  city: CityName;
  coordinates: Location;
  previewImage: string;
  type: Type;
  roomsCount: number;
  description: string;
  features: string[];
  user: User;
  images: string[];
  guestsCount: number;
};

export type NewOffer = Omit<Offer, 'id' | 'isFavorite' | 'rating' | 'user'>;

export type NewComment = Pick<Comment, 'text' | 'rating'>;
export type UserAuth = Pick<User, 'email'> & { password: string };
export type CommentAuth = NewComment &
  Pick<Offer, 'id'>;
export type FavoriteAuth = Offer['id'];
export type UserRegister = Omit<User, 'avatarUrl'> &
  Pick<UserAuth, 'password'> & { avatar?: File };
