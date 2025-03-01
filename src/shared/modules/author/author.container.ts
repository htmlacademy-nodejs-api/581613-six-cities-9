import { Container } from 'inversify';

import { AuthorService } from './author-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultAuthorService } from './default-author.service.js';

export function createAuthorContainer() {
  const authorContainer = new Container();
  authorContainer.bind<AuthorService>(Component.AuthorService).to(DefaultAuthorService).inSingletonScope();

  return authorContainer;
}
