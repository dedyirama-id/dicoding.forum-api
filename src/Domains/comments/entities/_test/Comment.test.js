const Comment = require('../Comment');

describe('Comment entities', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload1 = {
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const payload2 = {
      id: 'comment-123',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const payload3 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const payload4 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const payload5 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const payload6 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      updated_at: new Date(),
    };
    const payload7 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
    };

    // Action & Assert
    expect(() => new Comment(payload1)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment(payload2)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment(payload3)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment(payload4)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment(payload5)).not.toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment(payload6)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment(payload7)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const payload2 = {
      id: 'thread-123',
      content: 123,
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const payload3 = {
      id: 'thread-123',
      content: 'lorem ipsum',
      user_id: 123,
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const payload4 = {
      id: 'thread-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 123,
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const payload5 = {
      id: 'thread-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: 123,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const payload6 = {
      id: 'thread-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: 123,
      updated_at: new Date(),
    };
    const payload7 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: 123,
    };

    // Action & Assert
    expect(() => new Comment(payload1)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload2)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload3)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload4)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload5)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload6)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload7)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.content).toEqual(payload.content);
    expect(comment.owner).toEqual(payload.user_id);
    expect(comment.threadId).toEqual(payload.thread_id);
    expect(comment.parentCommentId).toEqual(payload.parent_comment_id);
    expect(comment.createdAt).toBeInstanceOf(Date);
    expect(comment.updatedAt).toBeInstanceOf(Date);
  });
});
