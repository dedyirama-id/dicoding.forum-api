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
    const payload2 = {
      id: 'comment-123',
      content: 'lorem ipsum',
      username: 'dicoding',
      created_at: new Date(),
      is_delete: true,
    };

    // Action
    const comment1 = new GetComment(payload1);
    const comment2 = new GetComment(payload2);

    // Assert
    expect(comment1).toBeInstanceOf(GetComment);
    expect(comment1.id).toEqual(payload1.id);
    expect(comment1.content).toEqual(payload1.content);
    expect(comment1.username).toEqual(payload1.username);
    expect(comment1.date).toEqual(payload1.created_at);

    expect(comment2).toBeInstanceOf(GetComment);
    expect(comment2.id).toEqual(payload2.id);
    expect(comment2.content).toEqual('**komentar telah dihapus**');
    expect(comment2.username).toEqual(payload2.username);
    expect(comment2.date).toEqual(payload2.created_at);
  });
});
