const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(userId, useCasePayload) {
    const newThread = new NewThread(useCasePayload);

    await this._userRepository.getUserById(userId);

    return this._threadRepository.addThread(userId, newThread);
  }
}

module.exports = AddThreadUseCase;
