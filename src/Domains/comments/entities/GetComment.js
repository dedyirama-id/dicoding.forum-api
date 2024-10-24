class GetComment {
  constructor(payload, deletedContent = '**komentar telah dihapus**') {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.created_at;
    this.content = (payload.is_delete === true) ? deletedContent : payload.content;
  }

  _verifyPayload(payload) {
    const {
      id,
      content,
      username,
      created_at: createdAt,
      is_delete: isDelete,
    } = payload;

    if (
      !id
      || !content
      || !username
      || !createdAt
      || isDelete === undefined
      || isDelete === null
    ) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof username !== 'string'
      || createdAt instanceof Date === false
      || typeof isDelete !== 'boolean'
    ) {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetComment;
