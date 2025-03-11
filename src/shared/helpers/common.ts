import { ClassConstructor, plainToInstance } from 'class-transformer';

import { COMMA_SEPARATOR, DEFAULT_ERROR_MESAGE } from '../constants/index.js';

export function generateRandomValue(min: number, max: number, numAfterDigit = 0) {
  return Number(((Math.random() * (max - min)) + min).toFixed(numAfterDigit));
}
export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function generateStringWithSeparatorFromArray<T>(items: T[]): string {
  return items.join(COMMA_SEPARATOR);
}

export function getRandomItemsToStringWithSeparator<T>(items: T[]): string {
  return generateStringWithSeparatorFromArray(getRandomItems(items));
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(0, items.length - 1)];
}
export function getRandomBoolean(): boolean {
  return Boolean(generateRandomValue(0, 2));
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : DEFAULT_ERROR_MESAGE;
}

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}

export function convertToNumber(primitive: string | number | undefined | null) {
  const numberValue = Number(primitive);

  if (Number.isNaN(numberValue)) {
    return 0;
  }

  return numberValue;
}

export const getDefaultInvalidText = (fieldName: string) => `invalid value for ${fieldName} property`;
