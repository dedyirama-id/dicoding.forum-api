const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const Comment = require('../../Domains/comments/entities/Comment');
const GetComment = require('../../Domains/comments/entities/GetComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const {
      content, owner, threadId, parentCommentId,
    } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [id, content, owner, threadId, parentCommentId],
    };
    const result = await this._pool.query(query);

    return new Comment({ ...result.rows[0] });
  }

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND is_delete = false',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    return new Comment({ ...result.rows[0] });
  }

  async getAllCommentsByThreadId(threadId) {
    const query = {
      text: `
      SELECT 
        c.id,
        c.content,
        c.created_at,
        u.username,
        c.is_delete
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE 
        c.thread_id = $1
    `,
      values: [threadId],
    };

    const results = await this._pool.query(query);

    return results.rows.map((result) => new GetComment(result));
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true, updated_at = NOW() WHERE id = $1 AND is_delete = false',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('komentar tidak ditemukan atau sudah dihapus');
    }
  }
}

module.exports = CommentRepositoryPostgres;
