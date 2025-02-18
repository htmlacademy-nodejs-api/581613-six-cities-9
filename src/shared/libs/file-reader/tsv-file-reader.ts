import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { FeatureType, Offer, OfferType, Coordinates, City } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';
  private tabSeparator = '\t';
  private commaSeparator = ',';
  private nextLineSeparator = '\n';

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
      .split(this.nextLineSeparator)
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
      rating,
      type,
      roomsCount,
      guestsCount,
      price,
      features,
      author,
      commentsCount,
      coordinates
    ] = line.split(this.tabSeparator);

    return {
      title,
      description,
      postDate: new Date(createdDate),
      city: city as City,
      previewImage,
      images: this.parseImages(images),
      premium: this.parseBoolean(premium),
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

  private parseBoolean(booleanSting: string): boolean {
    return booleanSting === 'true';
  }

  private parseImages(images: string): string[] {
    return images.split(this.commaSeparator);
  }

  private parseFeatures(features: string): FeatureType[] {
    return features.split(this.commaSeparator) as FeatureType[];
  }

  private parseCoordinates(coordinates: string): Coordinates {
    const [latitude, longitude] = coordinates.split(this.commaSeparator);
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
