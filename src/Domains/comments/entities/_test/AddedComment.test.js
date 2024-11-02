const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload1 = {
      content: 'lorem ipsum',
      user_id: 'user-123',
      is_delete: false,
    };
    const payload2 = {
      id: 'comment-123',
      user_id: 'user-123',
      is_delete: false,
    };
    const payload3 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      is_delete: false,
    };
    const payload4 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedComment(payload1)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedComment(payload2)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedComment(payload3)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedComment(payload4)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      content: 'lorem ipsum',
      user_id: 'user-123',
      is_delete: false,
    };
    const payload2 = {
      id: 'thread-123',
      content: 123,
      user_id: 'user-123',
      is_delete: false,
    };
    const payload3 = {
      id: 'thread-123',
      content: 'lorem ipsum',
      user_id: 123,
      is_delete: false,
    };
    const payload4 = {
      id: 'thread-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      is_delete: 123,
    };

    // Action & Assert
    expect(() => new AddedComment(payload1)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedComment(payload2)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedComment(payload3)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedComment(payload4)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      is_delete: false,
    };

    // Action
    const comment = new AddedComment(payload);

    // Assert
    expect(comment).toBeInstanceOf(AddedComment);
    expect(comment.id).toEqual('comment-123');
    expect(comment.content).toEqual('lorem ipsum');
    expect(comment.owner).toEqual('user-123');
  });

  it('should return deleted comment content correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      is_delete: true,
    };

    // Action
    const comment = new AddedComment(payload);

    // Assert
    expect(comment).toBeInstanceOf(AddedComment);
    expect(comment.id).toEqual('comment-123');
    expect(comment.content).toEqual('**komentar telah dihapus**');
    expect(comment.owner).toEqual('user-123');
  });
});
