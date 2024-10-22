class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.user_id = payload.owner;
    this.thread_id = payload.threadId;
    this.parent_comment_id = payload.parentCommentId;
  }

  _verifyPayload(payload) {
    const {
      content, owner, threadId, parentCommentId,
    } = payload;

    if (!content || !owner || !threadId) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string'
      || typeof owner !== 'string'
      || typeof threadId !== 'string'
      || (parentCommentId && typeof parentCommentId !== 'string')
    ) {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
