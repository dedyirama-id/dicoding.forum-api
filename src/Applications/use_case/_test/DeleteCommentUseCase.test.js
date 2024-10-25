const CommentRepository = require('../../../Domains/comments/CommentRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain valid payload', async () => {
    // Arrange
    const useCasePayload1 = {
      commentId: 'comment-123',
    };
    const useCasePayload2 = {
      userId: 'user-123',
    };
    const useCasePayload3 = {};
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload1))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    await expect(deleteCommentUseCase.execute(useCasePayload2))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    await expect(deleteCommentUseCase.execute(useCasePayload3))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if commentId or userId not string', async () => {
    // Arrange
    const useCasePayload1 = {
      commentId: 123,
      userId: 'user-123',
    };
    const useCasePayload2 = {
      commentId: 'comment-123',
      userId: 123,
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload1))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    await expect(deleteCommentUseCase.execute(useCasePayload2))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      userId: 'user-123',
    };
    const mockUserRepository = new UserRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.getUserById = jest.fn().mockResolvedValue({ id: 'user-123' });
    mockCommentRepository.getCommentById = jest.fn().mockResolvedValue({ owner: 'user-123' });
    mockCommentRepository.deleteCommentById = jest.fn().mockResolvedValue();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload)).resolves.not.toThrowError();

    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-123');
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith('comment-123');
  });
});
