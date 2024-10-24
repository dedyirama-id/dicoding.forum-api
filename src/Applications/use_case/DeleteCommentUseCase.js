class DeleteCommentUseCase {
  constructor({ commentRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { userId, commentId } = useCasePayload;

    const user = await this._userRepository.getUserById(userId);
    const comment = await this._commentRepository.getCommentById(commentId);

    if (user.id !== comment.owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.USER_ID_DONT_MATCH');
    }

    await this._commentRepository.deleteCommentById(commentId);
  }

  _validatePayload(payload) {
    const { userId, commentId } = payload;
    if (!userId || !commentId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof commentId !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
