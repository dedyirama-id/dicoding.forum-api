class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.parentCommentId = payload.parentCommentId;
  }

  _verifyPayload(payload) {
    const {
      content, parentCommentId,
    } = payload;

    if (!content) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string'
      || (parentCommentId && typeof parentCommentId !== 'string')
    ) {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
