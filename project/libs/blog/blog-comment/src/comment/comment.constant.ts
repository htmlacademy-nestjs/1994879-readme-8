export const MAX_COMMENTS_COUNT = 50;

export enum CommentOperationSummary {
  Create = 'Create a new comment for post',
  FindAll = 'Get all comments',
  FindOne = 'Get a comment by ID',
  Remove = 'Delete a comment by ID',
}

export enum CommentResponseDescription {
  Created = 'The post has been successfully created.',
  BadRequest = 'Bad Request.',
  All = 'List of comments.',
  Found = 'The comment found.',
  NotFound = 'Comments not found.',
  Deleted = 'The comment has been successfully deleted.',
}

export const CommentSwaggerMessage = {
  userId: { description: 'User ID', example: '3d11998b-f67f-480e-98ad-03bad6a22b64' },
  message: {
    description: 'Text of the comment.',
    example: 'Excellent article! When will there be a sequel?',
  },
};

export const CommentApiParam = {
  postId: { name: 'postId', description: 'Post ID', example: 'cm5si9w3v0000s17k60ck3ayj' },
};
