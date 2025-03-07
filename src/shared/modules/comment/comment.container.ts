import { Container } from 'inversify';

import { CommentService } from './comment-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultCommentService } from './default-comment.service.js';

export function createCommentContainer() {
  const commentContainer = new Container();
  commentContainer.bind<CommentService>(Component.UserService).to(DefaultCommentService).inSingletonScope();

  return commentContainer;
}
