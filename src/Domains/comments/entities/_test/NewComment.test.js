const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload1 = {
      owner: 'user-123',
      threadId: 'thread-123',
      parentCommentId: 'comment-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const payload2 = {
      content: 'lorem ipsum',
      threadId: 'thread-123',
      parentCommentId: 'comment-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const payload3 = {
      content: 'lorem ipsum',
      owner: 'user-123',
      parentCommentId: 'comment-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const payload4 = {
      content: 'lorem ipsum',
      owner: 'user-123',
      threadId: 'thread-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const payload5 = {
      content: 'lorem ipsum',
      owner: 'user-123',
      threadId: 'thread-123',
      parentCommentId: 'comment-123',
      updatedAt: new Date(),
    };
    const payload6 = {
      content: 'lorem ipsum',
      owner: 'user-123',
      threadId: 'thread-123',
      parentCommentId: 'comment-123',
      createdAt: new Date(),
    };

    // Action & Assert
    expect(() => new NewComment(payload1)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new NewComment(payload2)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new NewComment(payload3)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new NewComment(payload4)).not.toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new NewComment(payload5)).not.toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new NewComment(payload6)).not.toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload1 = {
      content: 123,
      owner: 'user-123',
      threadId: 'thread-123',
      parentCommentId: 'comment-123',
    };
    const payload2 = {
      content: 'lorem ipsum',
      owner: 123,
      threadId: 'thread-123',
      parentCommentId: 'comment-123',
    };
    const payload3 = {
      content: 'lorem ipsum',
      owner: 'user-123',
      threadId: 123,
      parentCommentId: 'comment-123',
    };
    const payload4 = {
      content: 'lorem ipsum',
      owner: 'user-123',
      threadId: 'thread-123',
      parentCommentId: 123,
    };

    // Action & Assert
    expect(() => new NewComment(payload1)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new NewComment(payload2)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new NewComment(payload3)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new NewComment(payload4)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'lorem ipsum',
      owner: 'user-123',
      threadId: 'thread-123',
      parentCommentId: null,
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment).toBeInstanceOf(NewComment);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.user_id).toEqual(payload.owner);
    expect(newComment.thread_id).toEqual(payload.threadId);
    expect(newComment.parent_comment_id).toEqual(payload.parentCommentId);
  });
});
