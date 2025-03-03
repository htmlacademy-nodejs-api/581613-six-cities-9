import { Container } from 'inversify';

import { AuthorService } from './author-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultAuthorService } from './default-author.service.js';
import { Controller } from '../../libs/rest/index.js';
import { AuthorController } from './author.controller.js';

export function createAuthorContainer() {
  const authorContainer = new Container();

  authorContainer.bind<AuthorService>(Component.AuthorService).to(DefaultAuthorService).inSingletonScope();
  authorContainer.bind<Controller>(Component.AuthorController).to(AuthorController).inSingletonScope();

  return authorContainer;
}
