const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload1 = {
      title: 'new title',
      body: 'lorem ipsum',
    };
    const payload2 = {
      owner: 'user-123',
      body: 'lorem ipsum',
    };
    const payload3 = {
      owner: 'user-123',
      title: 'new title',
    };

    // Action & Assert
    expect(() => new NewThread(payload1)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new NewThread(payload2)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => new NewThread(payload3)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload1 = {
      title: true,
      body: 'lorem ipsum',
      owner: 'user-123',
    };
    const payload2 = {
      title: 'title',
      body: 123,
      owner: 'user-123',
    };
    const payload3 = {
      title: 'title',
      body: 'lorem ipsum',
      owner: 123,
    };

    // Action & Assert
    expect(() => new NewThread(payload1)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new NewThread(payload2)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new NewThread(payload3)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'new title',
      body: 'lorem ipsum',
      owner: 'user-123',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});
