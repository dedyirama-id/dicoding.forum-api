const NewThread = require('../../../Domains/threads/entities/NewThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should throw error when add thread with invalid owner id', async () => {
    // Arange
    const useCasePayload = {
      owner: 'user-123',
      title: 'New thread',
      body: 'lorem ipsum',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    mockUserRepository.getUserById = jest.fn().mockImplementation(() => Promise.reject(new Error('USER_REPOSITORY.USER_NOT_FOUND')));
    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve());

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action & Assert
    await expect(addThreadUseCase.execute(useCasePayload)).rejects.toThrowError('USER_REPOSITORY.USER_NOT_FOUND');
  });

  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      title: 'New thread',
      body: 'lorem ipsum',
    };
    const mockThread = new Thread({
      id: 'thread-123',
      user_id: useCasePayload.owner,
      title: useCasePayload.title,
      body: useCasePayload.body,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: 'dicoding',
      fullname: 'dicoding indonesia',
      password: 'secret',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockThread));
    mockUserRepository.getUserById = jest.fn().mockImplementation(() => Promise.resolve(mockRegisteredUser));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(new Thread({
      id: 'thread-123',
      user_id: 'user-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      created_at: mockThread.createdAt,
      updated_at: mockThread.updatedAt,
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      owner: useCasePayload.owner,
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
    expect(mockThreadRepository.addThread).toBeCalledTimes(1);
  });
});
