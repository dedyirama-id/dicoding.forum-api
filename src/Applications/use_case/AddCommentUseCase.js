const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(threadId, userId, newCommentPayload) {
    const newComment = new NewComment(newCommentPayload);

    await this._userRepository.verifyUserAvailability(userId);
    await this._threadRepository.verifyThreadAvailability(threadId);

    if (newComment.parentCommentId) {
      await this._commentRepository.verifyCommentAvailability(newComment.parentCommentId);
    }

    return this._commentRepository.addComment(threadId, userId, newComment);
  }
}

module.exports = AddCommentUseCase;
