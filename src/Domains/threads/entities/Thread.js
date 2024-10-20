/* eslint-disable camelcase */
class Thread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.user_id;
  }

  _verifyPayload(payload) {
    const {
      id, title, body, user_id,
    } = payload;

    if (!id || !title || !body || !user_id) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || typeof user_id !== 'string'
    ) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Thread;
