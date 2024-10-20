const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const newThread = new NewThread(useCasePayload);
    try {
      await this._userRepository.getUserById(newThread.owner);
    } catch (error) {
      throw new Error('ADD_THREAD_USE_CASE.INVALID_USER_ID');
    }

    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
