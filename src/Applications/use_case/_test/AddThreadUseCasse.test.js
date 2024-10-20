const NewThread = require('../../../Domains/threads/entities/NewThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
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
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(useCasePayload);

    expect(addedThread).toStrictEqual(new Thread({
      id: 'thread-123',
      user_id: 'user-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      owner: useCasePayload.owner,
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});
