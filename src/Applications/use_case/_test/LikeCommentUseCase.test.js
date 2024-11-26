const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the unlike comment action when comment has been liked', async () => {
    // Arange
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.verifyUserAvailability = jest.fn().mockResolvedValue();
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyIsCommentLiked = jest.fn().mockResolvedValue(true);
    mockCommentRepository.addCommentLikeById = jest.fn().mockResolvedValue();
    mockCommentRepository.deleteCommentLikeById = jest.fn().mockResolvedValue();

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action & Assert
    await expect(likeCommentUseCase.execute('thread-123', 'comment-123', 'user-123')).resolves.not.toThrowError();

    expect(mockUserRepository.verifyUserAvailability).toHaveBeenCalledWith('user-123');
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.verifyIsCommentLiked).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.addCommentLikeById).not.toBeCalled();
    expect(mockCommentRepository.deleteCommentLikeById).toHaveBeenCalledWith('comment-123', 'user-123');
  });

  it('should orchestrating the like comment action', async () => {
    // Arange
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.verifyUserAvailability = jest.fn().mockResolvedValue();
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyIsCommentLiked = jest.fn().mockResolvedValue(false);
    mockCommentRepository.addCommentLikeById = jest.fn().mockResolvedValue();
    mockCommentRepository.deleteCommentLikeById = jest.fn().mockResolvedValue();

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action & Assert
    await expect(likeCommentUseCase.execute('thread-123', 'comment-123', 'user-123')).resolves.not.toThrowError();

    expect(mockUserRepository.verifyUserAvailability).toHaveBeenCalledWith('user-123');
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.verifyIsCommentLiked).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.addCommentLikeById).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.deleteCommentLikeById).not.toBeCalled();
  });

  it('should throw error when threadId is invalid', async () => {
    // Arange
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.verifyUserAvailability = jest.fn().mockResolvedValue();
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockRejectedValue(new Error());
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyIsCommentLiked = jest.fn().mockResolvedValue(false);
    mockCommentRepository.addCommentLikeById = jest.fn().mockResolvedValue();
    mockCommentRepository.deleteCommentLikeById = jest.fn().mockResolvedValue();

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action & Assert
    await expect(likeCommentUseCase.execute('thread-123', 'comment-123', 'user-123')).rejects.toThrowError();

    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.addCommentLikeById).not.toBeCalled();
    expect(mockCommentRepository.deleteCommentLikeById).not.toBeCalled();
  });

  it('should throw error when commentId is invalid', async () => {
    // Arange
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.verifyUserAvailability = jest.fn().mockResolvedValue();
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockRejectedValue(new Error());
    mockCommentRepository.verifyIsCommentLiked = jest.fn().mockResolvedValue(false);
    mockCommentRepository.addCommentLikeById = jest.fn().mockResolvedValue();
    mockCommentRepository.deleteCommentLikeById = jest.fn().mockResolvedValue();

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action & Assert
    await expect(likeCommentUseCase.execute('thread-123', 'comment-123', 'user-123')).rejects.toThrowError();

    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.addCommentLikeById).not.toBeCalled();
    expect(mockCommentRepository.deleteCommentLikeById).not.toBeCalled();
  });

  it('should throw error when uesrId is invalid', async () => {
    // Arange
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.verifyUserAvailability = jest.fn().mockRejectedValue(new Error());
    mockThreadRepository.verifyThreadAvailability = jest.fn().mockRejectedValue();
    mockCommentRepository.verifyCommentAvailability = jest.fn().mockResolvedValue();
    mockCommentRepository.verifyIsCommentLiked = jest.fn().mockResolvedValue(false);
    mockCommentRepository.addCommentLikeById = jest.fn().mockResolvedValue();
    mockCommentRepository.deleteCommentLikeById = jest.fn().mockResolvedValue();

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action & Assert
    await expect(likeCommentUseCase.execute('thread-123', 'comment-123', 'user-123')).rejects.toThrowError();

    expect(mockUserRepository.verifyUserAvailability).toHaveBeenCalledWith('user-123');
    expect(mockCommentRepository.addCommentLikeById).not.toBeCalled();
    expect(mockCommentRepository.deleteCommentLikeById).not.toBeCalled();
  });
});
