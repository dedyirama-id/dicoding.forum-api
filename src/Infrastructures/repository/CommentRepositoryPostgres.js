const CommentRepository = require('../../Domains/comments/CommentRepository');
const Comment = require('../../Domains/comments/entities/Comment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const {
      content, user_id: userId, thread_id: threadId, parent_comment_id: parentCommentId,
    } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [id, content, userId, threadId, parentCommentId],
    };
    const result = await this._pool.query(query);

    return new Comment({ ...result.rows[0] });
  }
}

module.exports = CommentRepositoryPostgres;
