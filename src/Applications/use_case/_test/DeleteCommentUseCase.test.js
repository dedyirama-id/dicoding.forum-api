const CommentRepository = require('../../../Domains/comments/CommentRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const commentId = 'comment-123';
    const userId = 'user-123';
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
    await expect(deleteCommentUseCase.execute(commentId, userId)).resolves.not.toThrowError();

    expect(mockUserRepository.getUserById).toHaveBeenCalledWith('user-123');
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith('comment-123');
  });
});
