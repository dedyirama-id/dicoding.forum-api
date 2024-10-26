const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(threadId, userId, newCommentPayload) {
    const newComment = new NewComment(newCommentPayload);

    await this._userRepository.getUserById(userId);
    await this._threadRepository.getThreadById(threadId);

    if (newComment.parentCommentId) {
      await this._commentRepository.getCommentById(newComment.parentCommentId);
    }

    return this._commentRepository.addComment(threadId, userId, newComment);
  }
}

module.exports = AddCommentUseCase;
