const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const Comment = require('../../../Domains/comments/entities/Comment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'lorem ipsum',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      // Action
      await commentRepository.addComment(newComment);

      // Assert
      const addedComment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(addedComment).toHaveLength(1);
    });

    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'lorem ipsum',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      // Action
      const addedComment = await commentRepository.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(new Comment({
        id: 'comment-123',
        content: newComment.content,
        user_id: newComment.owner,
        thread_id: newComment.threadId,
        parent_comment_id: null,
        created_at: addedComment.createdAt,
        updated_at: addedComment.updatedAt,
        is_delete: false,
      }));
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'lorem ipsum',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      await commentRepository.addComment(newComment);

      // Action
      await commentRepository.deleteCommentById('comment-123');

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
      expect(comment[0].is_delete).toBe(true);
    });

    it('should throw error when delete invalid comment', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'lorem ipsum',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      await commentRepository.addComment(newComment);
      await commentRepository.deleteCommentById('comment-123');

      // Action & Assert
      await expect(commentRepository.deleteCommentById('comment-123')).rejects.toThrowError(NotFoundError);
      await expect(commentRepository.deleteCommentById('invalid-comment')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getCommentById function', () => {
    it('should return comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'lorem ipsum',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      await commentRepository.addComment(newComment);

      // Action
      const getComment = await commentRepository.getCommentById('comment-123');

      // Assert
      expect(getComment).toBeDefined();
      expect(getComment.id).toBe('comment-123');
      expect(getComment.isDelete).toBe(false);
    });

    it('should not return deleted comment', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'lorem ipsum',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      await commentRepository.addComment(newComment);
      await commentRepository.deleteCommentById('comment-123');

      // Action & Assert
      await expect(() => commentRepository.getCommentById('comment-123')).rejects.toThrowError(NotFoundError);
    });
  });
});
