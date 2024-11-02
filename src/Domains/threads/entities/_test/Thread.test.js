const Thread = require('../Thread');

describe('Thread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload1 = {
      title: 'new title',
      body: 'lorem ipsum',
      user_id: 'user-123',
      created_at: new Date(),
      updated_at: new Date(),
      username: 'dicoding',
    };
    const payload2 = {
      id: 'thread-123',
      body: 'lorem ipsum',
      user_id: 'user-123',
      created_at: new Date(),
      updated_at: new Date(),
      username: 'dicoding',
    };
    const payload3 = {
      id: 'thread-123',
      title: 'new title',
      user_id: 'user-123',
      created_at: new Date(),
      updated_at: new Date(),
      username: 'dicoding',
    };
    const payload4 = {
      id: 'thread-123',
      title: 'new title',
      body: 'lorem ipsum',
      created_at: new Date(),
      updated_at: new Date(),
      username: 'dicoding',
    };
    const payload5 = {
      id: 'thread-123',
      title: 'new title',
      body: 'lorem ipsum',
      updated_at: new Date(),
      username: 'dicoding',
    };
    const payload6 = {
      id: 'thread-123',
      title: 'new title',
      body: 'lorem ipsum',
      created_at: new Date(),
      username: 'dicoding',
    };
    const payload7 = {
      id: 'thread-123',
      title: 'new title',
      body: 'lorem ipsum',
      created_at: new Date(),
    };

    // Action & Assert
    expect(() => new Thread(payload1)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Thread(payload2)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Thread(payload3)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Thread(payload4)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Thread(payload5)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Thread(payload6)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new Thread(payload7)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      title: 'title',
      body: 'lorem ipsum',
      user_id: 'user-123',
      created_at: new Date(),
      updated_at: new Date(),
      username: 'dicoding',
    };
    const payload2 = {
      id: 'thread-123',
      title: 123,
      body: 'lorem ipsum',
      user_id: 'user-123',
      created_at: new Date(),
      updated_at: new Date(),
      username: 'dicoding',
    };
    const payload3 = {
      id: 'thread-123',
      title: 'title',
      body: 123,
      user_id: 'user-123',
      created_at: new Date(),
      updated_at: new Date(),
      username: 'dicoding',
    };
    const payload4 = {
      id: 'thread-123',
      title: 'title',
      body: 'lorem ipsum',
      user_id: 123,
      created_at: new Date(),
      updated_at: new Date(),
      username: 'dicoding',
    };
    const payload5 = {
      id: 'thread-123',
      title: 'title',
      body: 'lorem ipsum',
      user_id: 123,
      created_at: 123,
      updated_at: new Date(),
      username: 'dicoding',
    };
    const payload6 = {
      id: 'thread-123',
      title: 'title',
      body: 'lorem ipsum',
      user_id: 123,
      created_at: new Date(),
      updated_at: 123,
      username: 'dicoding',
    };
    const payload7 = {
      id: 'thread-123',
      title: 'title',
      body: 'lorem ipsum',
      user_id: 123,
      created_at: new Date(),
      updated_at: 123,
      username: 123,
    };

    // Action & Assert
    expect(() => new Thread(payload1)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Thread(payload2)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Thread(payload3)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Thread(payload4)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Thread(payload5)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Thread(payload6)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Thread(payload7)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
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
      username: 'dicoding',
    };

    // Action
    const thread = new Thread(payload);

    // Assert
    expect(thread).toBeInstanceOf(Thread);
    expect(thread.id).toEqual('thread-123');
    expect(thread.title).toEqual('new title');
    expect(thread.body).toEqual('lorem ipsum');
    expect(thread.owner).toEqual('user-123');
    expect(thread.username).toEqual('dicoding');
    expect(thread.createdAt).toBeInstanceOf(Date);
    expect(thread.createdAt).toEqual(payload.created_at);
    expect(thread.updatedAt).toBeInstanceOf(Date);
    expect(thread.updatedAt).toEqual(payload.updated_at);
  });
});
