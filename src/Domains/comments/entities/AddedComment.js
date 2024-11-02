class AddedComment {
  constructor(payload, deletedContent = '**komentar telah dihapus**') {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.is_delete ? deletedContent : payload.content;
    this.owner = payload.user_id;
  }

  _verifyPayload(payload) {
    const {
      id,
      content,
      user_id: userId,
      is_delete: isDelete,
    } = payload;

    if (
      !id
      || !content
      || !userId
      || isDelete === undefined
      || isDelete === null
    ) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof userId !== 'string'
      || typeof isDelete !== 'boolean'
    ) {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
