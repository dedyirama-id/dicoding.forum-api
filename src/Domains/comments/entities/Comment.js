class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.user_id;
    this.threadId = payload.thread_id;
    this.parentCommentId = payload.parent_comment_id;
    this.createdAt = payload.created_at;
    this.updatedAt = payload.updated_at;
    this.isDelete = payload.is_delete;
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
      is_delete: isDelete,
    } = payload;

    if (
      !id
      || !content
      || !userId
      || !threadId
      || !createdAt
      || !updatedAt
      || isDelete === undefined
      || isDelete === null
    ) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof userId !== 'string'
      || typeof threadId !== 'string'
      || (parentCommentId && typeof parentCommentId !== 'string')
      || createdAt instanceof Date === false
      || updatedAt instanceof Date === false
      || typeof isDelete !== 'boolean'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
