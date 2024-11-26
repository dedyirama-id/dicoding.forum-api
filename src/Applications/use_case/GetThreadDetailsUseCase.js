class GetThreadDetailsUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    this._validatePayload(threadId);

    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getAllCommentsByThreadId(threadId);

    const parentComments = comments.filter((comment) => comment.parentCommentId === null);
    const replies = comments.filter((comment) => comment.parentCommentId !== null);

    const commentsWithReplies = parentComments.map((comment) => {
      const commentReplies = replies
        .filter((reply) => reply.parentCommentId === comment.id)
        .map((reply) => ({
          id: reply.id,
          username: reply.username,
          date: reply.createdAt,
          content: reply.isDelete ? '**balasan telah dihapus**' : reply.content,
          likeCount: reply.likeCount,
        }));

      return {
        id: comment.id,
        username: comment.username,
        date: comment.createdAt,
        content: comment.content,
        replies: commentReplies,
        likeCount: comment.likeCount,
      };
    });

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      username: thread.username,
      date: thread.createdAt,
      comments: commentsWithReplies,
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
