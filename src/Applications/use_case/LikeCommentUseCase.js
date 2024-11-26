class LikeCommentUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(threadId, commentId, userId) {
    await this._userRepository.verifyUserAvailability(userId);
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);

    const isCommentLiked = await this._commentRepository.verifyIsCommentLiked(commentId, userId);

    if (isCommentLiked) {
      return this._commentRepository.deleteCommentLikeById(commentId, userId);
    }

    return this._commentRepository.addCommentLikeById(commentId, userId);
  }
}

module.exports = LikeCommentUseCase;
