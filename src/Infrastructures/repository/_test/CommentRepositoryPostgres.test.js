const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
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
      await commentRepository.addComment('thread-123', 'user-123', newComment);

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
      const addedComment = await commentRepository.addComment('thread-123', 'user-123', newComment);

      // Assert
      expect(addedComment).toStrictEqual(new Comment({
        id: 'comment-123',
        content: 'lorem ipsum',
        user_id: 'user-123',
        thread_id: 'thread-123',
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

      await commentRepository.addComment('thread-123', 'user-123', newComment);

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

      await commentRepository.addComment('thread-123', 'user-123', newComment);
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

      await commentRepository.addComment('thread-123', 'user-123', newComment);

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

      await commentRepository.addComment('thread-123', 'user-123', newComment);
      await commentRepository.deleteCommentById('comment-123');

      // Action & Assert
      await expect(() => commentRepository.getCommentById('comment-123')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getAllCommentsByThreadId function', () => {
    it('should return all comments with their replies by thread id correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'userA' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'userB' });
      await UsersTableTestHelper.addUser({ id: 'user-789', username: 'userC' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'comment 1', threadId: 'thread-123', userId: 'user-123', isDelete: false,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456', content: 'reply to comment 1', threadId: 'thread-123', userId: 'user-456', parentCommentId: 'comment-123', isDelete: false,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-789', content: 'another reply to comment 1', threadId: 'thread-123', userId: 'user-789', parentCommentId: 'comment-123', isDelete: false,
      });

      // Action
      const comments = await commentRepository.getAllCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toBe('comment-123');
      expect(comments[0].content).toBe('comment 1');
      expect(comments[0].username).toBe('userA');
      expect(comments[0].replies).toHaveLength(2);

      expect(comments[0].replies[0].id).toBe('comment-456');
      expect(comments[0].replies[0].content).toBe('reply to comment 1');
      expect(comments[0].replies[0].username).toBe('userB');

      expect(comments[0].replies[1].id).toBe('comment-789');
      expect(comments[0].replies[1].content).toBe('another reply to comment 1');
      expect(comments[0].replies[1].username).toBe('userC');
    });

    it('should return an empty array when there are no comments for the thread id', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      // Action
      const comments = await commentRepository.getAllCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(0);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment is not found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'userA' });

      // Action & Assert
      await expect(commentRepository.verifyCommentOwner('comment-123', 'user-xxx')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when user is not the owner', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'userA' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'comment 1', threadId: 'thread-123', userId: 'user-123', isDelete: false,
      });

      // Action & Assert
      await expect(commentRepository.verifyCommentOwner('comment-123', 'user-xxx')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error when user is the owner', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'userA' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'comment 1', threadId: 'thread-123', userId: 'user-123', isDelete: false,
      });

      // Action & Assert
      await expect(commentRepository.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError();
    });
  });
});
