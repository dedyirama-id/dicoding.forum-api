const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const GetThread = require('../../Domains/threads/entities/GetThread');
const Thread = require('../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { owner, title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING *',
      values: [id, owner, title, body],
    };
    const result = await this._pool.query(query);

    return new Thread({ ...result.rows[0] });
  }

  async getThreadById(id) {
    const query = {
      text: `
        SELECT 
          t.id,
          t.title,
          t.body,
          t.created_at,
          u.username
        FROM threads t
        JOIN users u ON t.user_id = u.id
        WHERE 
          t.id = $1
        `,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new GetThread({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
