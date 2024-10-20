const Thread = require('../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { user_id: userId, title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING *',
      values: [id, userId, title, body],
    };
    const result = await this._pool.query(query);

    return new Thread({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;