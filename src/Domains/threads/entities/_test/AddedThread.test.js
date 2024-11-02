const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload1 = {
      title: 'new title',
      user_id: 'user-123',
    };
    const payload2 = {
      id: 'thread-123',
      user_id: 'user-123',
    };
    const payload3 = {
      id: 'thread-123',
      title: 'new title',
    };

    // Action & Assert
    expect(() => new AddedThread(payload1)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedThread(payload2)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new AddedThread(payload3)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload1 = {
      id: 123,
      title: 'new title',
      user_id: 'user-123',
    };
    const payload2 = {
      id: 'thread-123',
      title: 123,
      user_id: 'user-123',
    };
    const payload3 = {
      id: 'thread-123',
      title: 'new title',
      user_id: 123,
    };

    // Action & Assert
    expect(() => new AddedThread(payload1)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedThread(payload2)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new AddedThread(payload3)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'new title',
      user_id: 'user-123',
    };

    // Action
    const thread = new AddedThread(payload);

    // Assert
    expect(thread).toBeInstanceOf(AddedThread);
    expect(thread.id).toEqual('thread-123');
    expect(thread.title).toEqual('new title');
    expect(thread.owner).toEqual('user-123');
  });
});
