/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async addComment({
    id = 'comment-123',
    content = 'comment 1',
    userId = 'user-123',
    threadId = 'thread-123',
    parentCommentId = null,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
      values: [id, content, userId, threadId, parentCommentId],
    };

    await pool.query(query);
  },
};

module.exports = CommentsTableTestHelper;
