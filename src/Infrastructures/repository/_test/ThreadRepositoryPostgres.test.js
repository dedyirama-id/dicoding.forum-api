const ThreadTableHelper = require('../../../../tests/ThreadTableHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await ThreadTableHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      const newThread = new NewThread({
        owner: 'user-123',
        title: 'New title',
        body: 'lorem ipsum',
      });
      const user = new RegisterUser({
        username: 'johndoe',
        fullname: 'john doe',
        password: 'secret',
      });

      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser(user);
      await threadRepository.addThread(newThread);

      const addedThreads = await ThreadTableHelper.findThreadById('thread-123');
      expect(addedThreads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      const newThread = new NewThread({
        owner: 'user-123',
        title: 'New title',
        body: 'lorem ipsum',
      });
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepository.addThread(newThread);
      expect(addedThread).toStrictEqual(new Thread({
        id: 'thread-123',
        title: newThread.title,
        body: newThread.body,
        user_id: newThread.user_id,
      }));
    });
  });
});
