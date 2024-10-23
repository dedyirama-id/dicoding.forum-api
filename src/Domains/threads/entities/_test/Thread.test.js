const Thread = require('../Thread');

describe('Thread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload1 = {
      title: 'new title',
      body: 'lorem ipsum',
      user_id: 'user-123',
    };
    const payload2 = {
      id: 'thread-123',
      body: 'lorem ipsum',
      user_id: 'user-123',
    };
    const payload3 = {
      id: 'thread-123',
      title: 'new title',
      user_id: 'user-123',
    };
    const payload4 = {
      id: 'thread-123',
      title: 'new title',
      body: 'lorem ipsum',
    };

    // Action & Assert
    expect(() => new Thread(payload1)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Thread(payload2)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Thread(payload3)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Thread(payload4)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      title: 'title',
      body: 'lorem ipsum',
      user_id: 'user-123',
    };
    const payload2 = {
      id: 'thread-123',
      title: 123,
      body: 'lorem ipsum',
      user_id: 'user-123',
    };
    const payload3 = {
      id: 'thread-123',
      title: 'title',
      body: 123,
      user_id: 'user-123',
    };
    const payload4 = {
      id: 'thread-123',
      title: 'title',
      body: 'lorem ipsum',
      user_id: 123,
    };

    // Action & Assert
    expect(() => new Thread(payload1)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Thread(payload2)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Thread(payload3)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Thread(payload4)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Thread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'new title',
      body: 'lorem ipsum',
      user_id: 'user-123',
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Action
    const thread = new Thread(payload);

    // Assert
    expect(thread).toBeInstanceOf(Thread);
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.owner).toEqual(payload.user_id);
    expect(thread.createdAt).toEqual(payload.created_at);
    expect(thread.updatedAt).toEqual(payload.updated_at);
  });
});
