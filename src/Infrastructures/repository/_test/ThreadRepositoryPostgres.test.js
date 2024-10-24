const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepository postgres', () => {
  beforeAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        owner: 'user-123',
        title: 'New title',
        body: 'lorem ipsum',
      });

      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      // Action
      await threadRepository.addThread(newThread);

      // Assert
      const addedThreads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(addedThreads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        owner: 'user-123',
        title: 'New title',
        body: 'lorem ipsum',
      });
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      // Action
      const addedThread = await threadRepository.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(new Thread({
        id: 'thread-123',
        title: newThread.title,
        body: newThread.body,
        user_id: newThread.owner,
        created_at: addedThread.createdAt,
        updated_at: addedThread.updatedAt,
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should return thread details correctly', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, () => '123');

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'userA' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'Thread Title', body: 'Thread Body', owner: 'user-123',
      });

      // Action
      const thread = await threadRepository.getThreadById('thread-123');

      // Assert
      expect(thread).toBeDefined();
      expect(thread.id).toBe('thread-123');
      expect(thread.title).toBe('Thread Title');
      expect(thread.body).toBe('Thread Body');
      expect(thread.username).toBe('userA');
    });

    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, () => '123');

      // Action & Assert
      await expect(threadRepository.getThreadById('invalid-thread')).rejects.toThrowError(NotFoundError);
    });
  });
});
