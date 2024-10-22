const CommentRepository = require('../../../Domains/comments/CommentRepository');
const Comment = require('../../../Domains/comments/entities/Comment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should throw error when add comment with invalid owner id', async () => {
    // Arange
    const useCasePayload = {
      content: 'lorem ipsum',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.getUserById = jest.fn().mockImplementation(() => Promise.reject(new Error('USER_REPOSITORY.USER_NOT_FOUND')));
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve());

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrowError('USER_REPOSITORY.USER_NOT_FOUND');
  });

  it('should throw error when add comment with invalid thread id', async () => {
    // Arange
    const useCasePayload = {
      content: 'lorem ipsum',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.getUserById = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.reject(new Error('THREAD_REPOSITORY.THREAD_NOT_FOUND')));
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve());

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrowError('THREAD_REPOSITORY.THREAD_NOT_FOUND');
  });

  it('should throw orchestrating the add thread action', async () => {
    // Arange
    const useCasePayload = {
      content: 'lorem ipsum',
      owner: 'user-123',
      threadId: 'thread-123',
    };
    const mockThread = new Thread({
      id: 'thread-123',
      user_id: 'user-123',
      title: 'new title',
      body: 'lorem ipsum',
    });
    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: 'dicoding',
      fullname: 'dicoding indonesia',
      password: 'secret',
    });
    const mockComment = new Comment({
      id: 'thread-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.getUserById = jest.fn().mockImplementation(() => Promise.resolve(mockRegisteredUser));
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(mockComment));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(new Comment({
      id: 'thread-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(addedComment.createdAt),
      updated_at: new Date(addedComment.updatedAt),
    }));
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: 'lorem ipsum',
      owner: 'user-123',
      threadId: 'thread-123',
    }));
    expect(mockCommentRepository.addComment).toBeCalledTimes(1);
  });
});
