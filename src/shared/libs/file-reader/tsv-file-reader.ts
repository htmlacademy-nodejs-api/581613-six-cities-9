import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { FeatureType, Offer, OfferType, Coordinates, City } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) { }

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      createdDate,
      city,
      previewImage,
      images,
      premium,
      favourite,
      rating,
      type,
      roomsCount,
      guestsCount,
      price,
      features,
      author,
      commentsCount,
      coordinates
    ] = line.split('\t');

    return {
      title,
      description,
      postDate: new Date(createdDate),
      city: city as City,
      previewImage,
      images: this.parseImages(images),
      premium: JSON.parse(premium),
      favourite: JSON.parse(favourite),
      rating: Number(rating),
      type: type as OfferType,
      roomsCount: Number(roomsCount),
      guestsCount: Number(guestsCount),
      price: Number(price),
      features: this.parseFeatures(features),
      author,
      commentsCount: Number(commentsCount),
      coordinates: this.parseCoordinates(coordinates)
    };
  }

  private parseImages(images: string): string[] {
    return images.split(',');
  }

  private parseFeatures(features: string): FeatureType[] {
    return features.split(',') as FeatureType[];
  }

  private parseCoordinates(coordinates: string): Coordinates {
    const [latitude, longitude] = coordinates.split(',');
    return { latitude: Number(latitude), longitude: Number(longitude) };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
