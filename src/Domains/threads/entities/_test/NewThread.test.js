const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'lorem ipsum',
      userId: 'user-xxx',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      userId: 'user-xxx',
      threadId: 'thread-xxx',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      content: 'lorem ipsum',
      userId: 'user-xxx',
      threadId: 'thread-xxx',
      parentCommentId: 'comment-xxx',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.content).toEqual(payload.content);
    expect(newThread.userId).toEqual(payload.userId);
    expect(newThread.threadId).toEqual(payload.threadId);
    expect(newThread.parentCommentId).toEqual(payload.parentCommentId);
  });
});
