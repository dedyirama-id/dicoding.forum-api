class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.user_id;
    this.threadId = payload.thread_id;
    this.parentCommentId = payload.parent_comment_id;
    this.createdAt = new Date(payload.created_at);
    this.updatedAt = new Date(payload.updated_at);
  }

  _verifyPayload(payload) {
    const {
      id,
      content,
      user_id: userId,
      thread_id: threadId,
      parent_comment_id: parentCommentId,
      created_at: createdAt,
      updated_at: updatedAt,
    } = payload;

    // Validasi kehadiran properti
    if (
      !id
      || !content
      || !userId
      || !threadId
      || !createdAt
      || !updatedAt
    ) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof userId !== 'string'
      || typeof threadId !== 'string'
      || (parentCommentId && typeof parentCommentId !== 'string')
      || !this._isValidISODate(createdAt)
      || !this._isValidISODate(updatedAt)
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isValidISODate(dateString) {
    const isoFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
    return isoFormatRegex.test(dateString);
  }
}

module.exports = Comment;
