class Thread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.user_id;
    this.createdAt = payload.created_at;
    this.updatedAt = payload.updated_at;
  }

  _verifyPayload(payload) {
    const {
      id, title, body, user_id: userId, created_at: createdAt, updated_at: updatedAt,
    } = payload;

    if (!id || !title || !body || !userId || !createdAt || !updatedAt) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || typeof userId !== 'string'
      || createdAt instanceof Date === false
      || updatedAt instanceof Date === false
    ) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Thread;
