import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';
import { generateRandomValue, getRandomItem, generateStringWithSeparatorFromArray, getRandomBoolean, getRandomItemsToStringWithSeparator } from '../../helpers/index.js';
import { TAB_SEPARATOR } from '../../constants/common.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;
const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_ROOMS = 1;
const MAX_ROOMS = 8;
const MIN_GUESTS = 1;
const MAX_GUESTS = 10;
const MIN_COMMENTS = 0;
const MAX_COMMENTS = 50;
const MIN_COORDS_LATTITUDE = -90;
const MAX_COORDS_LATTITUDE = 90;
const MIN_COORDS_LONGITUDE = -180;
const MAX_COORDS_LONGITUDE = 180;
const MAX_COORDS_NUM_AFTER_DIGIT = 6;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) { }
  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem<string>(this.mockData.cities);
    const previewImage = getRandomItem<string>(this.mockData.images);
    const premium = getRandomBoolean();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const type = getRandomItem(this.mockData.offerTypes);
    const roomsCount = generateRandomValue(MIN_ROOMS, MAX_ROOMS);
    const guestsCount = generateRandomValue(MIN_GUESTS, MAX_GUESTS);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const features = getRandomItemsToStringWithSeparator(this.mockData.features);
    const user = getRandomItem(this.mockData.users);
    const commentsCount = generateRandomValue(MIN_COMMENTS, MAX_COMMENTS);
    const latitude = generateRandomValue(MIN_COORDS_LATTITUDE, MAX_COORDS_LATTITUDE, MAX_COORDS_NUM_AFTER_DIGIT);
    const longitude = generateRandomValue(MIN_COORDS_LONGITUDE, MAX_COORDS_LONGITUDE, MAX_COORDS_NUM_AFTER_DIGIT);
    const coordinates = generateStringWithSeparatorFromArray([latitude, longitude]);

    return [
      title, description, createdDate, city, previewImage, this.mockData.images, premium, rating, type, roomsCount, guestsCount, price, features, user, commentsCount, coordinates
    ].join(TAB_SEPARATOR);
  }
}
