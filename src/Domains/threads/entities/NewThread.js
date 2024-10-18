class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.userId = payload.userId;
    this.threadId = payload.threadId;
    this.parentCommentId = payload.parentCommentId;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
  }

  _verifyPayload(payload) {
    const {
      content, userId, threadId, parentCommentId, createdAt, updatedAt,
    } = payload;

    // Memastikan bahwa content, userId, dan threadId ada
    if (!content || !userId || !threadId) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    // Memastikan tipe data dan validasi parentCommentId
    if (
      typeof content !== 'string'
      || typeof userId !== 'string'
      || typeof threadId !== 'string'
      || (parentCommentId !== null && (typeof parentCommentId !== 'string' || parentCommentId === ''))
      || (createdAt && (typeof createdAt !== 'string' || !this._isValidDate(createdAt)))
      || (updatedAt && (typeof updatedAt !== 'string' || !this._isValidDate(updatedAt)))
    ) {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  // Fungsi untuk memvalidasi format tanggal
  _isValidDate(dateString) {
    const date = new Date(dateString);
    return !Number.isNaN(date.getTime()); // Menggunakan Number.isNaN
  }
}

module.exports = NewThread;
