const ThreadTableHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepository postgres', () => {
  beforeAll(async () => {
    await ThreadTableHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await ThreadTableHelper.cleanTable();
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
      const user = new RegisterUser({
        username: 'dicoding',
        fullname: 'dicoding indonesia',
        password: 'secret',
      });

      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(user);
      await threadRepository.addThread(newThread);

      // Action
      const addedThreads = await ThreadTableHelper.findThreadById('thread-123');

      // Assert
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
      await UsersTableTestHelper.addUser({});

      // Action
      const addedThread = await threadRepository.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(new Thread({
        id: 'thread-123',
        title: newThread.title,
        body: newThread.body,
        user_id: newThread.user_id,
      }));
    });
  });

  describe('getThreadByIdFunction function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadRepository.getThreadById('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        owner: 'user-123',
        title: 'New title',
        body: 'lorem ipsum',
      });
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({});
      await ThreadTableHelper.addThread(newThread);

      // Action
      const thread = await threadRepository.getThreadById('thread-123');

      // Assert
      expect(thread).toStrictEqual(new Thread({
        id: 'thread-123',
        title: newThread.title,
        body: newThread.body,
        user_id: newThread.user_id,
      }));
    });
  });
});
