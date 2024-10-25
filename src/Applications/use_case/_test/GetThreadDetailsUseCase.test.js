const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');

describe('GetThreadDetailsUseCase', () => {
  it('should throw error when payload is not contain threadId', async () => {
    // Arange
    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({});
    const useCasePayload = {};

    // Action & Assert
    await expect(getThreadDetailsUseCase.execute(useCasePayload)).rejects.toThrowError('GET_THREAD_DETAILS_USE_CASE.NOT_CONTAIN_THREAD_ID');
  });

  it('should throw error when given invalid threadId', async () => {
    // Arange
    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({});
    const useCasePayload = {
      threadId: 123,
    };

    // Action & Assert
    await expect(getThreadDetailsUseCase.execute(useCasePayload)).rejects.toThrowError('GET_THREAD_DETAILS_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw orchestrating the get thread details action', async () => {
    // Arange
    const thread = new GetThread({
      id: 'thread-123',
      title: 'new title',
      body: 'lorem ipsum',
      username: 'dicoding',
      created_at: new Date(),
    });

    const comment = new GetComment({
      id: 'comment-123',
      content: 'lorem ipsum',
      username: 'dicoding',
      created_at: new Date(),
      is_delete: false,
    });

    const user = new RegisteredUser({
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(thread);
    mockCommentRepository.getAllCommentsByThreadId = jest.fn().mockResolvedValue([{ ...comment }]);

    const useCasePayload = {
      threadId: 'thread-123',
    };

    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const commentDetails = await getThreadDetailsUseCase.execute(useCasePayload);

    // Assert
    expect(commentDetails).toStrictEqual({
      id: 'thread-123',
      title: 'new title',
      body: 'lorem ipsum',
      username: user.username,
      date: thread.date,
      comments: [
        {
          id: comment.id,
          username: user.username,
          date: comment.date,
          content: comment.content,
        },
      ],
    });

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.getAllCommentsByThreadId).toHaveBeenCalledWith('thread-123');
  });
});
