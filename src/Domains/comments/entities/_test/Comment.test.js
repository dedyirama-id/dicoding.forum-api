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
      is_delete: false,
      username: 'dicoding',
      like_count: 10,
    };
    const payload2 = {
      id: 'comment-123',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_delete: false,
      username: 'dicoding',
      like_count: 10,
    };
    const payload3 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_delete: false,
      username: 'dicoding',
      like_count: 10,
    };
    const payload4 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_delete: false,
      username: 'dicoding',
      like_count: 10,
    };
    const payload5 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      created_at: new Date(),
      updated_at: new Date(),
      is_delete: false,
      username: 'dicoding',
      like_count: 10,
    };
    const payload6 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      updated_at: new Date(),
      is_delete: false,
      username: 'dicoding',
      like_count: 10,
    };
    const payload7 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      is_delete: false,
      username: 'dicoding',
      like_count: 10,
    };
    const payload8 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      username: 'dicoding',
      like_count: 10,
    };
    const payload9 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      like_count: 10,
    };
    const payload10 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Action & Assert
    expect(() => new Comment(payload1)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment(payload2)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment(payload3)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment(payload4)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment(payload5)).not.toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment(payload6)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment(payload7)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment(payload8)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment(payload9)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Comment(payload10)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
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
      is_delete: false,
      username: 'dicoding',
      like_count: 10,
    };
    const payload2 = {
      id: 'thread-123',
      content: 123,
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_delete: false,
      username: 'dicoding',
      like_count: 10,
    };
    const payload3 = {
      id: 'thread-123',
      content: 'lorem ipsum',
      user_id: 123,
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_delete: false,
      username: 'dicoding',
      like_count: 10,
    };
    const payload4 = {
      id: 'thread-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 123,
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_delete: false,
      username: 'dicoding',
      like_count: 10,
    };
    const payload5 = {
      id: 'thread-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: 123,
      created_at: new Date(),
      updated_at: new Date(),
      is_delete: false,
      username: 'dicoding',
      like_count: 10,
    };
    const payload6 = {
      id: 'thread-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: 123,
      updated_at: new Date(),
      is_delete: false,
      username: 'dicoding',
      like_count: 10,
    };
    const payload7 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: 123,
      is_delete: false,
      username: 'dicoding',
      like_count: 10,
    };
    const payload8 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_delete: 123,
      username: 'dicoding',
      like_count: 10,
    };
    const payload9 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_delete: false,
      username: 123,
      like_count: 10,
    };
    const payload10 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_delete: false,
      username: 123,
      like_count: 'sepuluh',
    };

    // Action & Assert
    expect(() => new Comment(payload1)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload2)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload3)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload4)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload5)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload6)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload7)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload8)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload9)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comment(payload10)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
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
      is_delete: false,
      username: 'dicoding',
      like_count: 10,
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.id).toEqual('comment-123');
    expect(comment.content).toEqual('lorem ipsum');
    expect(comment.owner).toEqual('user-123');
    expect(comment.threadId).toEqual('thread-123');
    expect(comment.parentCommentId).toEqual(null);
    expect(comment.createdAt).toBeInstanceOf(Date);
    expect(comment.createdAt).toEqual(payload.created_at);
    expect(comment.updatedAt).toBeInstanceOf(Date);
    expect(comment.updatedAt).toEqual(payload.updated_at);
    expect(comment.isDelete).toEqual(false);
    expect(comment.username).toEqual('dicoding');
    expect(comment.likeCount).toEqual(10);
  });

  it('should return deleted comment content correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_delete: true,
      username: 'dicoding',
      like_count: 10,
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.id).toEqual('comment-123');
    expect(comment.content).toEqual('**komentar telah dihapus**');
    expect(comment.owner).toEqual('user-123');
    expect(comment.threadId).toEqual('thread-123');
    expect(comment.parentCommentId).toEqual(null);
    expect(comment.createdAt).toBeInstanceOf(Date);
    expect(comment.createdAt).toEqual(payload.created_at);
    expect(comment.updatedAt).toBeInstanceOf(Date);
    expect(comment.updatedAt).toEqual(payload.updated_at);
    expect(comment.isDelete).toEqual(true);
    expect(comment.username).toEqual('dicoding');
    expect(comment.likeCount).toEqual(10);
  });
});
