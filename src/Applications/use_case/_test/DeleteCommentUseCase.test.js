const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const commentId = 'comment-123';
    const userId = 'user-123';
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getCommentById = jest.fn().mockResolvedValue({ owner: 'user-123' });
    mockCommentRepository.verifyCommentOwner = jest.fn().mockResolvedValue();
    mockCommentRepository.deleteCommentById = jest.fn().mockResolvedValue();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(commentId, userId)).resolves.not.toThrowError();

    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith('comment-123');
  });
});
