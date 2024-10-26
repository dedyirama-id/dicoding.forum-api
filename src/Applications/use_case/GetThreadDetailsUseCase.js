class GetThreadDetailsUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    this._validatePayload(threadId);

    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getAllCommentsByThreadId(threadId);

    return {
      ...thread,
      comments,
    };
  }

  _validatePayload(payload) {
    if (!payload) {
      throw new Error('GET_THREAD_DETAILS_USE_CASE.NOT_CONTAIN_THREAD_ID');
    }

    if (typeof payload !== 'string') {
      throw new Error('GET_THREAD_DETAILS_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadDetailsUseCase;
