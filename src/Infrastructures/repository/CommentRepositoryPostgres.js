const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const Comment = require('../../Domains/comments/entities/Comment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(threadId, userId, newComment) {
    const {
      content, parentCommentId,
    } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [id, content, userId, threadId, parentCommentId],
    };
    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async getCommentById(id) {
    const query = {
      text: `
        SELECT 
          c.*,
          u.username
        FROM comments c 
        JOIN users u ON c.user_id = u.id
        WHERE c.id = $1
        `,
      values: [id],
    };
    const result = await this._pool.query(query);

    return new Comment({ ...result.rows[0] });
  }

  async getAllCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT 
          c.*,
          u.username
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.thread_id = $1
        ORDER BY c.created_at ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    const comments = result.rows.map((row) => ({ ...new Comment(row) }));

    return comments;
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true, updated_at = NOW() WHERE id = $1 AND is_delete = false',
      values: [id],
    };

    await this._pool.query(query);
  }

  async verifyCommentOwner(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND is_delete = false',
      values: [commentId],
    };
    const result = await this._pool.query(query);

    const commentOwner = result.rows[0].user_id;

    if (commentOwner !== userId) {
      throw new AuthorizationError('bukan pemilik komentar');
    }
  }

  async verifyCommentAvailability(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND is_delete = false',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
