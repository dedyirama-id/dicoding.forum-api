class GetThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.date = payload.created_at;
    this.username = payload.username;
  }

  _verifyPayload(payload) {
    const {
      id, title, body, username, created_at: createdAt,
    } = payload;

    if (!id
      || !title
      || !body
      || !username
      || !createdAt) {
      throw new Error('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || typeof username !== 'string'
      || createdAt instanceof Date === false
    ) {
      throw new Error('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThread;
