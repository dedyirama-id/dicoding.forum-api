const GetComment = require('../GetComment');

describe('GetComment entities', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload1 = {
      content: 'lorem ipsum',
      username: 'dicoding',
      created_at: new Date(),
      is_delete: false,
    };
    const payload2 = {
      id: 'comment-123',
      username: 'dicoding',
      created_at: new Date(),
      is_delete: false,
    };
    const payload3 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      created_at: new Date(),
      is_delete: false,
    };
    const payload4 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      username: 'dicoding',
      is_delete: false,
    };
    const payload5 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      username: 'dicoding',
      created_at: new Date(),
    };

    // Action & Assert
    expect(() => new GetComment(payload1)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new GetComment(payload2)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new GetComment(payload3)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new GetComment(payload4)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new GetComment(payload5)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      content: 'lorem ipsum',
      username: 'dicoding',
      created_at: new Date(),
      is_delete: false,
    };
    const payload2 = {
      id: 'comment-123',
      content: 123,
      username: 'dicoding',
      created_at: new Date(),
      is_delete: false,
    };
    const payload3 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      username: 123,
      created_at: new Date(),
      is_delete: false,
    };
    const payload4 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      username: 'dicoding',
      created_at: 123,
      is_delete: false,
    };
    const payload5 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      username: 'dicoding',
      created_at: new Date(),
      is_delete: 123,
    };

    // Action & Assert
    expect(() => new GetComment(payload1)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetComment(payload2)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetComment(payload3)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetComment(payload4)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new GetComment(payload5)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetComment entities correctly', () => {
    // Arrange
    const payload1 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      username: 'dicoding',
      created_at: new Date(),
      is_delete: false,
    };

    // Action
    const comment = new GetComment(payload1);

    // Assert
    expect(comment).toBeInstanceOf(GetComment);
    expect(comment.id).toEqual('comment-123');
    expect(comment.content).toEqual('lorem ipsum');
    expect(comment.username).toEqual('dicoding');
    expect(comment.date).toBeInstanceOf(Date);
  });

  it('should return deleted comment content correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'lorem ipsum',
      username: 'dicoding',
      created_at: new Date(),
      is_delete: true,
    };

    // Action
    const comment = new GetComment(payload);

    // Assert
    expect(comment).toBeInstanceOf(GetComment);
    expect(comment.id).toEqual('comment-123');
    expect(comment.content).toEqual('**komentar telah dihapus**');
    expect(comment.username).toEqual('dicoding');
    expect(comment.date).toBeInstanceOf(Date);
    expect(comment.date).toEqual(payload.created_at);
  });
});
