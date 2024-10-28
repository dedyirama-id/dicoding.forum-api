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
    };

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.getUserById = jest.fn().mockRejectedValue(new Error());
    mockCommentRepository.addComment = jest.fn().mockResolvedValue();

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute('thread-123', 'user-123', useCasePayload)).rejects.toThrowError();

    expect(mockUserRepository.getUserById).toBeCalledTimes(1);
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-123');
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

    mockUserRepository.getUserById = jest.fn().mockResolvedValue();
    mockThreadRepository.getThreadById = jest.fn().mockRejectedValue(new Error());
    mockCommentRepository.addComment = jest.fn().mockResolvedValue();

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute('thread-123', 'user-123', useCasePayload)).rejects.toThrowError();

    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-123');
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
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

    mockUserRepository.getUserById = jest.fn().mockResolvedValue();
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue();
    mockCommentRepository.addComment = jest.fn().mockResolvedValue();
    mockCommentRepository.getCommentById = jest.fn().mockRejectedValue(new Error());

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute('thread-123', 'user-123', useCasePayload)).rejects.toThrowError();

    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-123');
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.addComment).not.toBeCalled();
  });

  it('should orchestrating the add comment action', async () => {
    // Arange
    const useCasePayload = {
      content: 'lorem ipsum',
    };
    const mockThread = new Thread({
      id: 'thread-123',
      user_id: 'user-123',
      title: 'new title',
      body: 'lorem ipsum',
      created_at: new Date(),
      updated_at: new Date(),
    });
    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: 'dicoding',
      fullname: 'dicoding indonesia',
      password: 'secret',
    });
    const mockComment = new Comment({
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_delete: false,
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
    const addedComment = await addCommentUseCase.execute('thread-123', 'user-123', useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(new Comment({
      id: 'comment-123',
      content: 'lorem ipsum',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_comment_id: null,
      created_at: new Date(addedComment.createdAt),
      updated_at: new Date(addedComment.updatedAt),
      is_delete: false,
    }));
    expect(mockCommentRepository.addComment).toBeCalledTimes(1);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith('thread-123', 'user-123', new NewComment({
      content: 'lorem ipsum',
      owner: 'user-123',
      threadId: 'thread-123',
    }));
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-123');
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
  });
});
