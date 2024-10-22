const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const newComment = new NewComment(useCasePayload);

    await this._userRepository.getUserById(newComment.user_id);
    await this._threadRepository.getThreadById(newComment.thread_id);

    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
