const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const newThread = new NewThread(useCasePayload);

    await this._userRepository.getUserById(newThread.user_id);

    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
