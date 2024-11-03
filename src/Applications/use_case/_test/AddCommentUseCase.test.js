const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should throw error when add comment with invalid owner id', async () => {
    // Arange
    const useCasePayload = {
      content: 'lorem ipsum',
    };

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.verifyUserAvailability = jest.fn().mockRejectedValue(new Error());
    mockCommentRepository.addComment = jest.fn().mockResolvedValue();

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute('thread-123', 'user-123', useCasePayload)).rejects.toThrowError();

    expect(mockUserRepository.verifyUserAvailability).toBeCalledTimes(1);
    expect(mockUserRepository.verifyUserAvailability).toHaveBeenCalledWith('user-123');
    expect(mockCommentRepository.addComment).not.toBeCalled();
  });

  it('should throw error when add comment with invalid thread id', async () => {
    // Arange
    const useCasePayload = {
      content: 'lorem ipsum',
    };

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.verifyUserAvailability = jest.fn().mockResolvedValue();
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockRejectedValue(new Error());
    mockCommentRepository.addComment = jest.fn().mockResolvedValue();

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute('thread-123', 'user-123', useCasePayload)).rejects.toThrowError();

    expect(mockUserRepository.verifyUserAvailability).toHaveBeenCalledWith('user-123');
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.addComment).not.toBeCalled();
  });

  it('should throw error when add comment with invalid parentCommentId', async () => {
    // Arrange
    const useCasePayload = {
      content: 'lorem ipsum',
      parentCommentId: 'comment-123',
    };

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.verifyUserAvailability = jest.fn().mockResolvedValue();
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockResolvedValue();
    mockCommentRepository.addComment = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockRejectedValue(new Error());

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute('thread-123', 'user-123', useCasePayload)).rejects.toThrowError();

    expect(mockUserRepository.verifyUserAvailability).toHaveBeenCalledWith('user-123');
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.addComment).not.toBeCalled();
  });

  it('should orchestrating the add comment action', async () => {
    // Arange
    const useCasePayload = {
      content: 'lorem ipsum',
    };
    const mockComment = new AddedComment({
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_delete: false,
      username: 'dicoding',
    });

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.verifyUserAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(mockComment));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute('thread-123', 'user-123', useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(addedComment.createdAt),
      updated_at: new Date(addedComment.updatedAt),
      is_delete: false,
      username: 'dicoding',
    }));
    expect(mockCommentRepository.addComment).toBeCalledTimes(1);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith('thread-123', 'user-123', new NewComment({
      content: 'lorem ipsum',
      owner: 'user-123',
      threadId: 'thread-123',
    }));
    expect(mockUserRepository.verifyUserAvailability).toHaveBeenCalledWith('user-123');
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
  });
});
