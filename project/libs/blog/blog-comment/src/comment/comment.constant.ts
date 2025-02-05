export const MAX_COMMENTS_COUNT = 50;

export const CommentMessage = {
  NotFound: 'Comment not found',
  AccessDeny: "Unable to delete someone else's comment",
  SaveError: "Couldn't save the comment. Check the data.",
};

export enum CommentResponseDescription {
  Created = 'The post has been successfully created.',
  BadRequest = 'Bad Request.',
  All = 'List of comments.',
  Found = 'The comment found.',
  NotFound = 'Comments not found.',
  Deleted = 'The comment has been successfully deleted.',
}
