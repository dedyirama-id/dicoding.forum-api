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
          u.username,
          COALESCE(COUNT(l.comment_id), 0)::INTEGER AS like_count
        FROM comments c 
        JOIN users u ON c.user_id = u.id
        LEFT JOIN user_comment_likes l ON c.id = l.comment_id
        WHERE c.id = $1
        GROUP BY c.id, u.id
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
        u.username,
        COALESCE(COUNT(l.comment_id), 0)::INTEGER AS like_count
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN user_comment_likes l ON c.id = l.comment_id
      WHERE c.thread_id = $1
      GROUP BY c.id, u.id
      ORDER BY c.created_at ASC
    `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    const comments = result.rows.map((row) => (new Comment(row)));

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

  async verifyIsCommentLiked(commentId, userId) {
    const query = {
      text: 'SELECT * FROM user_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      return false;
    }

    return true;
  }

  async addCommentLikeById(commentId, userId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3) RETURNING *',
      values: [id, userId, commentId],
    };

    await this._pool.query(query);
  }

  async deleteCommentLikeById(commentId, userId) {
    const query = {
      text: 'DELETE FROM user_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('comment record not found');
    }
  }
}

module.exports = CommentRepositoryPostgres;
