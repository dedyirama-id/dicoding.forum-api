const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      parentCommentId: 'comment-123',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload1 = {
      content: 123,
      parentCommentId: 'comment-123',
    };
    const payload2 = {
      content: 'lorem ipsum',
      parentCommentId: 123,
    };

    // Action & Assert
    expect(() => new NewComment(payload1)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new NewComment(payload2)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'lorem ipsum',
      parentCommentId: null,
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment).toBeInstanceOf(NewComment);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.parentCommentId).toEqual(payload.parentCommentId);
  });
});
