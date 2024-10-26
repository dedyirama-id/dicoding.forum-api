class DeleteCommentUseCase {
  constructor({ commentRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._userRepository = userRepository;
  }

  async execute(commentId, userId) {
    const user = await this._userRepository.getUserById(userId);
    const comment = await this._commentRepository.getCommentById(commentId);

    if (user.id !== comment.owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.USER_ID_DO_NOT_MATCH');
    }

    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
